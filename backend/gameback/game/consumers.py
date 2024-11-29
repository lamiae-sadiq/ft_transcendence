import json
import random

from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio

from . import gameLogic
import aiohttp

import requests

# rooms = {}
rooms_game_logic = {}
player_queue = [] 
room_task = {}
player2Channel = {
    'channel_name':'',
    'self' : None
}
class pingPongConsumer(AsyncWebsocketConsumer):
 
    async def connect(self):
        self.game_type = self.scope['url_route']['kwargs']['game_type']
        if(self.game_type == 'remote'):
            print('*****connected****')
            # self.room_name = self.scope['url_route']['kwargs']['room_name']
            self.room_name = None
            self.room_group_name = None
            self.playerID = None
            self.other_playerId = None
            # await self.channel_layer.group_add(
            #     self.room_group_name,
            #     self.channel_name
            # )
        elif(self.game_type == 'local'):
            self.gameStatus = gameLogic.gameData()
        elif(self.game_type == 'tournament'):
            self.gameStatus = gameLogic.gameData()
            
        await self.accept()
       #send a message to the client
    async def disconnect(self, close_code):
        
        if(self.game_type == 'remote'):
            print(self.playerID)
            # if(self.playerID in player_queue):
            #     player_queue.remove(self.playerID)
            if(self.playerID in player_queue):
                player_queue.remove(self.playerID)
                
            # print('channale name = ',self.channel_name , 'channel name 2 ', player2Channel)
            print(self.room_group_name)
            if self.room_group_name is not None:
                print('room deleted')
                #send a message to the other client that the game is over
                print(self.playerID)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'send_game',
                        'message': {
                            'event':'gameOver',
                            'winner':self.other_playerId
                        }
                    }
                )
                await self.channel_layer.group_discard(
                    self.room_group_name,
                    self.channel_name
                )
                
                
                if self.room_group_name in rooms_game_logic:
                    del rooms_game_logic[self.room_group_name]
                if self.room_group_name in room_task:
                    print('task cancelled')
                    room_task[self.room_group_name].cancel()
                    del room_task[self.room_group_name]
            print('room game logic = ',len(rooms_game_logic) , 'room task = ',len(room_task) , 'player queue = ',len(player_queue))
        if self.game_type == 'local' or self.game_type == 'tournament':            
            if self.task:
                self.task.cancel()
                self.keepSending = False
                print('task cancelled')
            del self.gameStatus
        
        
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if(self.game_type == 'local'):
            game = gameLogic.gamelogic()
            # text_data_json = json.loads(text_data)
            #receive message from the client and send the first draw
            if(text_data_json.get('message')):
                if(text_data_json['message'] == 'Hello, server!'):
                    game.windowSize(text_data_json)
                    game.sendDraw(self.gameStatus)
                    self.keepSending = True
                    self.task = asyncio.create_task(self.sendPing(self.gameStatus))
                    return
            elif(text_data_json.get('event')):
                event = text_data_json['event']
            #hande new size event
                if(event == 'newSize'):
                    self.sendData = game.parseSize(text_data_json,self.gameStatus)
                    await self.send(text_data=json.dumps(self.sendData))
                elif(event == 'movement'):
                    game.parsmove(text_data_json, self.gameStatus)
                elif(event == 'start'):
                    self.gameStatus.startTheGame = True
                    self.gameStatus.firstInstructions = False
                elif(event == 'pause'):
                    self.gameStatus.pause = not self.gameStatus.pause
        if(self.game_type == 'remote'):
            # text_data_json = json.loads(text_data)
            if(text_data_json.get('message') == 'Hello, server!'):
                self.playerID = text_data_json.get('id')
                # print('id = ',self.playerID ,'channel = ',self.channel_name)
                if not self.room_group_name:
                    await self.assign_player_to_room(self.playerID)
                else:
                    print('no room')
                if self.room_group_name:
                    print('room = ',self.room_group_name)
            # print('room = ',self.room_group_name)
            if(self.room_group_name and text_data_json.get('event') == 'movement'):
                rooms_game_logic[self.room_group_name].parsMove(text_data_json)
            # if(self.room_group_name and text_data_json.get('event') == 'start'):
            #     rooms_game_logic[self.room_group_name].startTheGame = True
            #     rooms_game_logic[self.room_group_name].firstInstructions = False
        if(self.game_type == 'tournament'):
            game = gameLogic.gamelogic()
            if(text_data_json.get('message') == 'Hello, server!'):
                self.playerNames = text_data_json.get('names')
                game.windowSize(text_data_json)
                game.sendDraw(self.gameStatus)
                self.task = asyncio.create_task(self.tournamentGame(self.gameStatus))
                return
            elif(text_data_json.get('event')):
                event = text_data_json['event']
                if(event == 'newSize'):
                    self.sendData = game.parseSize(text_data_json,self.gameStatus)
                    await self.send(text_data=json.dumps(self.sendData))
                elif(event == 'movement'):
                    game.parsmove(text_data_json, self.gameStatus)
                elif(event == 'start'):
                    self.gameStatus.startTheGame = True
                    self.gameStatus.firstInstructions = False
                elif(event == 'pause'):
                    self.gameStatus.pause = not self.gameStatus.pause
                    
    async def sendPing(self, gameStatus):
          
        while gameStatus.keepSending:
            if(gameStatus.pause):
                pass
            else:
                gameStatus.calculation()
            json_data = gameStatus.toJson()
            await asyncio.sleep(0.006)
            await self.send(text_data=json.dumps(json_data))
            #await self.send(text_data=json.dumps(json_data))
            if(gameStatus.event == 'draw'):
                gameStatus.event = ''
    #remote game
    async def assign_player_to_room(self,playerId):
        global player2Channel
        # global player_queue
        print('player id in assign = ',playerId)
        player_queue.append(playerId)
        # player_queue.append(self.channel_name)
        if(len(player_queue) >= 2):
            print('room created', player_queue)
            player1 = player_queue.pop(0)
            # player1channel = player_queue.pop(0)
            player2 = player_queue.pop(0)
            # player2channel = player_queue.pop(0)
            
            self.room_name = f'room_{player1}_{player2}'
            self.room_group_name = f'pingPong_{self.room_name}'
            
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.channel_layer.group_add(self.room_group_name, player2Channel['channel_name'])
            if(self.room_group_name not in  rooms_game_logic):
                rooms_game_logic[self.room_group_name] = gameLogic.remotGameLogic()
            rooms_game_logic[self.room_group_name].event = 'draw'
            # rooms_game_logic[self.room_group_name].player1 = {
            #     'channel_name':self.channel_name,
            #     'height': self.height,
            #     'width': self.width
            # }
            # rooms_game_logic[self.room_group_name].player2 = player2Channel
            player2Channel['self'].room_group_name = self.room_group_name
            rooms_game_logic[self.room_group_name].player1 = self.playerID
            rooms_game_logic[self.room_group_name].player2 = player2Channel['self'].playerID
            self.other_playerId = player2Channel['self'].playerID
            if(self.room_group_name not in room_task):
                room_task[self.room_group_name] = asyncio.create_task(self.sendPingRemote(rooms_game_logic[self.room_group_name]))
            # print('room length = ',len(rooms) , 'room game logic = ',len(rooms_game_logic) , 'room task = ',len(room_task) , 'player queue = ',len(player_queue))
        else:
            # player2Channel = self.channel_name
            player2Channel = {
                'channel_name':self.channel_name,
                'self': self
            }
    async def sendPingRemote(self, game):
        
        # game = rooms_game_logic[game]
        
        while game.keepSending:
            game.calculation()
            json_data = game.toJson()
            await asyncio.sleep(0.006)
            await self.handle_remote(json_data)
            if(game.event == 'draw'):
                game.event = ''
        
                
    async def handle_remote(self, message):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_game',
                'message': message
                # 'message': game.toJson()
            }
        )
    async def send_game(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))
    #tournament
    async def tournamentGame(self, gameStatus):
        # len of the players
        self.playersNum = len(self.playerNames)
        #send request for tournament id
        url = "http://0.0.0.0:8000/smartcontract/create-tournament/"
        headers = {"Accept": "application/json"}

        try:
            response = requests.post(url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                tournament_id = data.get("tournamentId")
                print(f"Tournament ID: {tournament_id}")
            else:
                print(f"Failed to get tournament ID. Status code: {response.status}")
                print(response.text)
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
        # generate random groups
        self.groupss_Players = self.generateRandomGroups()
        self.n = self.playersNum - 1
        while self.n > 0:
            if(self.playersNum - self.n == 1):
                if hasattr(self, 'winners'):
                    self.groupss_Players.append(self.winners)
                self.groNum = len(self.groupss_Players) - 1
                self.groNum = int(self.groNum)
                # print(self.groNum)
                json_data = {
                    'groups':self.groupss_Players,
                    'event':'tournament'
                }
                await self.send(text_data=json.dumps(json_data))
                await asyncio.sleep(7)
                self.playersNum /= 2
            if(self.groNum >= 0):
                print('players: ',self.groupss_Players[self.groNum])
                json_data = {
                    'players':self.groupss_Players[self.groNum],
                    'event':'OneVsOne'
                }
                self.groNum -= 1
            await self.send(text_data=json.dumps(json_data))
            await asyncio.sleep(4)
            #add the game here
            await self.tournamentPingPong(self.gameStatus)
            print('winner = ',gameStatus.winner)
            if not hasattr(self, 'winners'):
                self.winners = []
            if(gameStatus.winner == 'left'):
                print(self.groupss_Players[self.groNum + 1][0])
                self.winners.append(self.groupss_Players[self.groNum + 1][0])
            else:
                print(self.groupss_Players[self.groNum + 1][1])
                self.winners.append(self.groupss_Players[self.groNum + 1][1])
            #send data
            url = 'http://0.0.0.0:8000/smartcontract/record-match/'

            # Construct the data to be sent in the request
            data = {
                'tournament_id': self.tournament_id,
                'player1_name': self.groupss_Players[self.groNum + 1][0],
                'player1_score': gameStatus.leftPlayerScore,
                'player2_name': self.groupss_Players[self.groNum + 1][1],
                'player2_score': gameStatus.rightPlayerScore
            }

            # Send the POST request using requests
            response = requests.post(url, json=data)

            # Check if the request was successful
            if response.status_code == 200:
                print("Result sent successfully")
            else:
                print(f"Failed to send result. Status code: {response.status_code}")
            self.restoreGame(self.gameStatus)
            self.n -= 1
        print('winners = ',self.winners)
        json_data = {
            'winner':self.winners[self.n - 1],
            'event':'winner'
        }
        await self.send(text_data=json.dumps(json_data))
        
        
    def generateRandomGroups(self):
        groups_Players = []
        random.shuffle(self.playerNames)
        for i in range(0, len(self.playerNames), 2):
            groups_Players.append(self.playerNames[i:i+2])
        return groups_Players
    
    async def tournamentPingPong(self,gameStatus):
        # winner = random.choice(self.groups[self.groNum])
        # if not hasattr(self, 'winners'):
        #     self.winners = []
        # self.winners.append(winner)
        gameStatus.event = 'draw'
        gameStatus.keepSending = True
        while gameStatus.keepSending:
            if(gameStatus.pause):
                pass
            else:
                gameStatus.calculation()
            json_data = gameStatus.toJson()
            await asyncio.sleep(0.006)
            await self.send(text_data=json.dumps(json_data))
            #await self.send(text_data=json.dumps(json_data))
            if(gameStatus.event == 'draw'):
                gameStatus.event = ''
                
    def restoreGame(self,gameStatus):
        gameStatus.startTheGame = False
        gameStatus.firstInstructions = True
        gameStatus.pause = False
        gameStatus.keepSending = False
        gameStatus.leftPlayerScore = 0
        gameStatus.rightPlayerScore = 0
        gameStatus.winner = ''
        gameStatus.begin = True
        gameStatus.keycontrol = False
        gameStatus.key = ''
        