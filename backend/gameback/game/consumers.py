import json
import random
import logging
import requests
from asgiref.sync import sync_to_async
import httpx

logger = logging.getLogger('django')

from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio

from . import gameLogic


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
            self.nickname = None
            self.level = 0
            self.wins = 0
            self.token = None
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
                    if(rooms_game_logic[self.room_group_name].keepSending):
                        if rooms_game_logic[self.room_group_name].player1 == self.playerID:
                            rooms_game_logic[self.room_group_name].sendResultDataBase(rooms_game_logic[self.room_group_name].player2_Name)
                        elif rooms_game_logic[self.room_group_name].player2 == self.playerID:
                            rooms_game_logic[self.room_group_name].sendResultDataBase(rooms_game_logic[self.room_group_name].player1_Name)
                    print('object deleted')
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
                    self.token = text_data_json.get('token')
                    await self.sendRequestInfo()
                    self.gameStatus.name = self.nickname
                    print('name = ',self.nickname)
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
            if(text_data_json.get('message') == 'Hello, server!'):
                #send request with the token to get player id
                self.token = text_data_json.get('token')
                print('main token = ',self.token)
                await self.sendRequestInfo()
                await self.send(text_data=json.dumps({
                    'message': 'remote-id',
                    'id': self.playerID
                }))
                if not self.room_group_name:
                    await self.assign_player_to_room(self.playerID)
                else:
                    print('no room')
                if self.room_group_name:
                    print('room = ',self.room_group_name)
            if(self.room_group_name and text_data_json.get('event') == 'movement'):
                rooms_game_logic[self.room_group_name].parsMove(text_data_json)
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
            rooms_game_logic[self.room_group_name].player1_Name = self.nickname
            rooms_game_logic[self.room_group_name].player2_Name = player2Channel['self'].nickname
            rooms_game_logic[self.room_group_name].player1_level = self.level
            rooms_game_logic[self.room_group_name].player2_level = player2Channel['self'].level
            rooms_game_logic[self.room_group_name].player1_total_wins = self.wins
            rooms_game_logic[self.room_group_name].player2_total_wins = player2Channel['self'].wins
            rooms_game_logic[self.room_group_name].player1_token = self.token
            rooms_game_logic[self.room_group_name].player2_token = player2Channel['self'].token
            
            
            self.other_playerId = player2Channel['self'].nickname
            player2Channel['self'].other_playerId = self.nickname
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
        # await game.sendResultDataBase(game.winner)
                
    async def handle_remote(self, message):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_game',
                'message': message
                # 'message': game.toJson()
            }
        )

    @sync_to_async
    def sendRequestInfo(self):
        url = "http://web:8000/userinfo/"
        
        headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + self.token
        }
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                self.playerID = data.get("id")
                self.nickname = data.get("nickname")
                self.level = data.get("level")
                self.wins = data.get("wins")
                print(data)

            else:
                print(f"Failed to get user info. Status code: {response.status_code}")
                print(response.text)
        except requests.exceptions.ConnectionError as e:
            print(f"Connection error occurred: {e}")
        except requests.exceptions.Timeout as e:
            print(f"Timeout error occurred: {e}")
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
        

   
    @sync_to_async
    def sendRequest(self):
        #send request for tournament id
        url = "http://web:8000/smartcontract/create-tournament/"
        # Define the headers
        headers = {
            'Accept': 'application/json',
        }

        try:
            print("**********************************************")
            print(f"Sending request to {url} with headers {headers}")
            response = requests.post(url, headers=headers)
            print(response)
            print(response.status_code)
            
            if response.status_code == 200:
                data = response.json()
                tournament_id = data.get("tournamentId")
                print(f"Tournament ID: {tournament_id}")
                return tournament_id
            else:
                print(f"Failed to get tournament ID. Status code: {response.status}")
                print(response.text)
        except requests.exceptions.ConnectionError as e:
            print(f"Connection error occurred: {e}")
        except requests.exceptions.Timeout as e:
            print(f"Timeout error occurred: {e}")
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
    
    # # @sync_to_async
    # async def sendResult(self, tournament_id, player1_name, player1_score, player2_name, player2_score):
    #     url = "http://web:8000/smartcontract/record-match/"

    #     # Define the headers
    #     headers = {
    #         'Accept': 'application/json',
    #     }

    #     # Construct the data to be sent in the request
    #     data = {
    #         'tournament_id': tournament_id,
    #         'player1_name': player1_name,
    #         'player1_score': player1_score,
    #         'player2_name': player2_name,
    #         'player2_score': player2_score
    #     }

    #     # Send the POST request using requests
    #     print("**********************************************")
        
    #     # requests.post(url, json=data, headers=headers)
    #     async with httpx.AsyncClient() as client:
    #         # Fire and forget the request
    #         try:
    #             await client.post(url, json=data, headers=headers)
    #         except Exception as e:
    #             print(f"Error occurred while sending the request: {e}")
        

    # @sync_to_async
    async def sendResult(self, tournament_id, player1_name, player1_score, player2_name, player2_score):
        url = "http://web:8000/smartcontract/record-match/"
        # url = "https://google.com"
        headers = {'Accept': 'application/json'}
        data = {
            'tournament_id': tournament_id,
            'player1_name': player1_name,
            'player1_score': player1_score,
            'player2_name': player2_name,
            'player2_score': player2_score
        }
        async def post_request():
            timeout = 10  # Increase timeout to 10 seconds

            async with httpx.AsyncClient(timeout=timeout) as client:
                try:
                    response = await client.post(url, json=data, headers=headers)
                    response.raise_for_status()  # Raise error for non-2xx responses
                    print(f"Request succeeded with response: {response.text}")
                    return
                except (httpx.RequestError, httpx.HTTPStatusError) as e:
                    print(f"Error occurred: {e}")
                except Exception as e:
                    print(f"Unexpected error: {e}")

        # Schedule the asynchronous request
        asyncio.create_task(post_request())
        print("Request sent asynchronously.")
            
            
    async def send_game(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))
    #tournament
    async def tournamentGame(self, gameStatus):
        # len of the players
        self.playersNum = len(self.playerNames)
         #send request for tournament id

        tournament_id = await self.sendRequest()
        if tournament_id:
            print(f"Successfully received tournament ID: {tournament_id}")
        else:
            print("Failed to fetch tournament ID.")
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
            await  self.sendResult(tournament_id, self.groupss_Players[self.groNum + 1][0], gameStatus.leftPlayerScore, self.groupss_Players[self.groNum + 1][1], gameStatus.rightPlayerScore)
            
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