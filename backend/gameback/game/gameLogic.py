import json
import random
import time
import requests
import math
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio

class gamelogic:
    
    def __init__(self):
        self.canvaswidth = 0
        self.canvasheight = 0
        self.windowWidth = 0
        self.windowHeight = 0
        self.isBot = False
        self.botSpeed = 0.004
    def windowSize(self, jsondata):
        if(jsondata.get('width')):
            self.windowWidth = jsondata['width']
        if(jsondata.get('height')):
            self.windowHeight = jsondata['height']
        if(jsondata.get('mode')):
            if(jsondata['mode'] == 'bot'):
                print('bot mode')
                self.isBot = True
                if(jsondata['difficulty']):
                    if(jsondata['difficulty'] == 'easy'):
                        self.botSpeed = 0.0040
                    elif(jsondata['difficulty'] == 'normal'):
                        self.botSpeed = 0.045
                    elif(jsondata['difficulty'] == 'hard'):
                        self.botSpeed = 0.0048

            
    def sendDraw(self, gameStatus):
        self.newSize = self.reSize(self.windowWidth, self.windowHeight)
        gameStatus.event = 'draw'
        gameStatus.canvasWidth = self.l7sabat(self.newSize[0])
        gameStatus.canvasHeight = self.l7sabat(self.newSize[1])
        gameStatus.isBot = self.isBot
        if(self.isBot):
            gameStatus.botSpeed = self.botSpeed

        
    def reSize(self, windoWidth, windoHeight):
        self.canvaswidth = windoWidth / 1.8
        self.canvasheight = windoHeight / 3
        return self.canvaswidth, self.canvasheight
    
    def parseSize(self,jsonData, gameStatus):
        if(jsonData.get('width')):
            self.windowWidth = jsonData['width']
        if(jsonData.get('height')):
            self.windowHeight = jsonData['height']
            self.newSize = self.reSize(self.windowWidth, self.windowHeight)
            newCanvas = {
                'event': 'newSize',
                'newCanvasWidth': self.l7sabat(self.newSize[0]),
                'newCanvasHeight': self.l7sabat(self.newSize[1])
            }
            gameStatus.oldHeight = gameStatus.canvasHeight
            gameStatus.canvasWidth = self.l7sabat(self.newSize[0])
            gameStatus.canvasHeight = self.l7sabat(self.newSize[1])
            gameStatus.xLeft = 0
            gameStatus.yLeft = gameStatus.l7sabat((gameStatus.canvasHeight * gameStatus.yLeft) / gameStatus.oldHeight)
            gameStatus.xRight = gameStatus.l7sabat(gameStatus.canvasWidth - gameStatus.l7sabat(gameStatus.canvasWidth * 0.02))
            gameStatus.yRight = gameStatus.l7sabat((gameStatus.canvasHeight * gameStatus.yRight) / gameStatus.oldHeight)
            gameStatus.ball['x'] = gameStatus.l7sabat((gameStatus.canvasHeight * gameStatus.ball['x']) / gameStatus.oldHeight)
            gameStatus.ball['y'] = gameStatus.l7sabat((gameStatus.canvasHeight * gameStatus.ball['y']) / gameStatus.oldHeight)
            gameStatus.ball['radius'] = gameStatus.l7sabat((gameStatus.canvasHeight * gameStatus.ball['radius']) / gameStatus.oldHeight)
            gameStatus.ball['vx'] = gameStatus.l7sabat((gameStatus.canvasHeight * gameStatus.ball['vx']) / gameStatus.oldHeight)
            gameStatus.ball['vy'] = gameStatus.l7sabat((gameStatus.canvasHeight * gameStatus.ball['vy']) / gameStatus.oldHeight)
            gameStatus.ball['speed'] = gameStatus.l7sabat((gameStatus.canvasHeight * gameStatus.ball['speed']) / gameStatus.oldHeight)
            gameStatus.fontsize = gameStatus.l7sabat((gameStatus.canvasHeight * gameStatus.fontsize) / gameStatus.oldHeight)
            gameStatus.heightPaddleSize = gameStatus.l7sabat(gameStatus.canvasHeight / 6)
            gameStatus.widthPaddleSize = gameStatus.l7sabat(gameStatus.canvasWidth * 0.02)
            return newCanvas
    def parsmove(self, jsonData, gameStatus):
            if(jsonData.get('key')):
                gameStatus.key = jsonData['key']
                if all(value == False for value in gameStatus.key.values()):
                    gameStatus.keycontrol = False
                else:
                    gameStatus.keycontrol = True
    
    def l7sabat(self,num):
        return round(float(num), 2)
    
    def firstdraw(self):
        return {
            'event': 'firstDraw',
            'canvasWidth': self.l7sabat(self.canvaswidth),
            'canvasHeight': self.l7sabat(self.canvasheight)
        }
        
class gameData:
    
    def __init__(self):
        print('gameData initialized')
        
        self.canvasWidth = 0
        self.canvasHeight = 0
        self.windowWidth = 0
        self.windowHeight = 0
        self.oldHeight = 0
        self.newSize = 0
        self.event = ''
        self.newCanvasWidth = 0
        self.newCanvasHeight = 0
        self.ball = {
            'x': 100,
            'y': 100,
            'vx': 5,
            'vy': 0,
            'radius': 25,
            'color': '#FF00E5',
            'speed': 5
        }
        self.xRight = 0
        self.xLeft = 0
        self.yRight = 0
        self.yLeft = 0
        self.heightPaddleSize = 0
        self.widthPaddleSize = 0
        self.keycontrol = False
        self.key = ''
        self.begin = True
        self.rightPlayerScore = 0
        self.leftPlayerScore = 0
        self.startTheGame = False
        self.isBot = False
        # easy self.botSpeed = 0.004
        # normal self.botSpeed = 0.043
        # hard self.botSpeed = 0.0048
        self.botSpeed = 0
        self.fontsize = 0
        self.pause = False
        self.firstInstructions = True
        self.winner = ''
        self.keepSending = True
        self.name = ''
        #tournament
        self.groups = []
        self.tourHight = 0
        self.tourWidth = 0
        
    def toJson(self):
        # widthPaddleSize = self.widthPaddleSize
        # widthPaddleSize = self.l7sabat(widthPaddleSize)
        
        data = {
            'canvasWidth': self.l7sabat(self.canvasWidth),
            'canvasHeight': self.l7sabat(self.canvasHeight),
            'windowWidth': self.l7sabat(self.windowWidth),
            'windowHeight': self.l7sabat(self.windowHeight),
            'newSize': self.l7sabat(self.newSize),
            'event': self.event,
            'newCanvasWidth': self.l7sabat(self.newCanvasWidth),
            'newCanvasHeight': self.l7sabat(self.newCanvasHeight),
            'ball': self.ball,
            'xRight': self.l7sabat(self.xRight),
            'xLeft': self.l7sabat(self.xLeft),
            'yRight': self.l7sabat(self.yRight),
            'yLeft': self.l7sabat(self.yLeft),
            'heightPaddleSize': self.l7sabat(self.heightPaddleSize),
            'widthPaddleSize': self.l7sabat(self.widthPaddleSize),
            'leftPlayerScore': self.leftPlayerScore,
            'rightPlayerScore': self.rightPlayerScore,
            'startTheGame': self.startTheGame,
            'fontSize': self.l7sabat(self.fontsize),
            'firstInstructions': self.firstInstructions,
            'winner': self.winner,
            'name': self.name,
            
        }
        return data
        
        
    def l7sabat(self, num):
        return round(float(num), 2)
    
    def calculation(self):
        if(self.begin):
            if(self.leftPlayerScore == 4 or self.rightPlayerScore == 4):
                self.event = 'gameOver'
                self.winner = 'left' if self.leftPlayerScore == 4 else 'right'
                self.keepSending = False
                self.firstInstructions = True
                return
            self.heightPaddleSize = self.l7sabat(self.canvasHeight / 6)
            self.widthPaddleSize = self.l7sabat(self.canvasWidth * 0.02)
            self.fontsize = self.l7sabat(self.canvasHeight * 0.03)
            self.xRight = self.l7sabat(self.canvasWidth - self.l7sabat((self.canvasWidth * 0.02)))
            self.yRight = self.l7sabat(self.canvasHeight / 2 - self.heightPaddleSize / 2)
            self.xLeft = 0
            self.yLeft = self.l7sabat(self.canvasHeight / 2 - self.heightPaddleSize / 2)
            self.ball['x'] = self.l7sabat(self.canvasWidth / 2)
            self.ball['y'] = self.l7sabat(self.canvasHeight / 2)
            self.ball['radius'] = self.l7sabat(self.canvasHeight / 50)
            random_value = random.choice([-1, 1])
            self.ball['vx'] = random_value * self.l7sabat(self.canvasHeight / 200)
            random_value = random.choice([0,0.3,0.2,0.1])
            self.ball['vy'] = random_value * self.l7sabat(self.canvasHeight / 200)
            self.ball['speed'] = self.l7sabat(self.canvasHeight / 200)
            self.begin = False
            self.startTheGame = False
            self.pause = False
        elif(self.startTheGame):
            
            if(self.isBot):
                self.botMovement()
            self.ball['x'] += self.ball['vx']
            self.ball['y'] += self.ball['vy']
            self.ball['x'] = self.l7sabat(self.ball['x'])
            self.ball['y'] = self.l7sabat(self.ball['y'])
            # ball collision with top and bottom walls
            if(self.ball['y'] + self.ball['vy'] > self.canvasHeight - self.ball['radius'] or self.ball['y'] + self.ball['vy'] < self.ball['radius']):
                self.ball['vy'] = -self.ball['vy']
                self.ball['vy'] = self.l7sabat(self.ball['vy'])
            #ball collision with left and right walls 
            if(self.ball['x'] + self.ball['vx'] > self.canvasWidth - self.ball['radius'] or self.ball['x'] + self.ball['vx'] < self.ball['radius']):
                if(self.ball['x'] + self.ball['vx'] > self.canvasWidth - self.ball['radius']):
                    self.leftPlayerScore += 1
                    # print('right player score: ', self.rightPlayerScore)
                if(self.ball['x'] + self.ball['vx'] < self.ball['radius']):
                    self.rightPlayerScore += 1
                    # print('left player score: ', self.leftPlayerScore)
                self.begin = True
                return
            #ball collision with the left paddle
            if(self.ball['x'] - self.ball['radius'] < self.xLeft + self.l7sabat(self.canvasWidth * 0.02) and 
               self.ball['y'] + self.ball['radius'] > self.yLeft and 
               self.ball['y'] - self.ball['radius'] < self.yLeft + self.l7sabat(self.canvasHeight / 6)):
                relY = self.ball['y'] - (self.yLeft + self.l7sabat(self.canvasHeight / 6) / 2)
                angle = relY / (self.l7sabat(self.canvasHeight / 6) / 2)
                self.ball['vx'] = abs(self.ball['vx'])
                self.ball['vy'] += angle * 2
                self.ball['vy'] = self.l7sabat(self.ball['vy'])
                self.ball['vx'] = self.l7sabat(self.ball['vx'])
                #prevent the ball from getting stuck inside the racket
                self.ball['x'] = self.xLeft + self.l7sabat(self.canvasWidth * 0.02) + self.ball['radius']
                self.ball['x'] = self.l7sabat(self.ball['x'])
                #limit the y velocity
                if(self.ball['vy'] > self.ball['speed']):
                    self.ball['vy'] = self.ball['speed']
                    self.ball['vy'] = self.l7sabat(self.ball['vy'])
                elif(self.ball['vy'] < -self.ball['speed']):
                    self.ball['vy'] = -self.ball['speed']
                    self.ball['vy'] = self.l7sabat(self.ball['vy'])
            #ball collision with the right paddle
            if(self.ball['x'] + self.ball['radius'] > self.xRight and 
               self.ball['y'] + self.ball['radius'] > self.yRight and 
               self.ball['y'] - self.ball['radius'] < self.yRight + self.l7sabat(self.canvasHeight / 6)):
                relY = self.ball['y'] - (self.yRight + self.l7sabat(self.canvasHeight / 6) / 2)
                angle = relY / (self.l7sabat(self.canvasHeight / 6) / 2)
                self.ball['vx'] = -abs(self.ball['vx'])
                self.ball['vy'] += angle * 2
                self.ball['vy'] = self.l7sabat(self.ball['vy'])
                self.ball['vx'] = self.l7sabat(self.ball['vx'])
                #prevent the ball from getting stuck inside the racket
                self.ball['x'] = self.l7sabat(self.xRight - self.ball['radius'])
                #limit the y velocity
                if(self.ball['vy'] > self.ball['speed']):
                    self.ball['vy'] = self.ball['speed']
                    self.ball['vy'] = self.l7sabat(self.ball['vy'])
                elif(self.ball['vy'] < -self.ball['speed']):
                    self.ball['vy'] = -self.ball['speed']
                    self.ball['vy'] = self.l7sabat(self.ball['vy'])
        
        if(self.keycontrol):
            self.handlingMovement()
        
        
    def handlingMovement(self):
        if(self.key == ''):
            return
        if(self.key.get('w')):
            if(self.yLeft > 0):
                self.yLeft -= self.l7sabat(self.canvasHeight / 200)
                self.yLeft = self.l7sabat(self.yLeft)
            if(self.yLeft < 0):
                self.yLeft = 0
        if(self.key.get('s')):
            
            if(self.yLeft < self.l7sabat(self.canvasHeight - self.l7sabat(self.canvasHeight / 6))):
                self.yLeft += self.l7sabat(self.canvasHeight / 200)
                self.yLeft = self.l7sabat(self.yLeft)
            if(self.yLeft > self.l7sabat(self.canvasHeight - self.l7sabat(self.canvasHeight / 6))):
                self.yLeft = self.l7sabat(self.canvasHeight - self.l7sabat(self.canvasHeight / 6))
        if(self.isBot):
            return
        if(self.key.get('ArrowUp')):
            if(self.yRight > 0):
                self.yRight -= self.l7sabat(self.canvasHeight / 200)
                self.yRight = self.l7sabat(self.yRight)
            if(self.yRight < 0):
                self.yRight = 0
        if(self.key.get('ArrowDown')):
            if(self.yRight < self.l7sabat(self.canvasHeight - self.l7sabat(self.canvasHeight / 6))):
                self.yRight += self.l7sabat(self.canvasHeight / 200)
                self.yRight = self.l7sabat(self.yRight)
            if(self.yRight > self.l7sabat(self.canvasHeight - self.l7sabat(self.canvasHeight / 6))):
                self.yRight = self.l7sabat(self.canvasHeight - self.l7sabat(self.canvasHeight / 6))
    def botMovement(self):
          # Move bot paddle towards the ball's y-position
        if self.ball['y'] < self.yRight:
            # Move the bot paddle up
            self.yRight -= self.l7sabat(self.canvasHeight * self.botSpeed)
            if self.yRight < 0:
                self.yRight = 0
        elif self.ball['y'] > self.yRight + self.heightPaddleSize:
            # Move the bot paddle down
            self.yRight += self.l7sabat(self.canvasHeight * self.botSpeed)
            if self.yRight > self.canvasHeight - self.heightPaddleSize:
                self.yRight = self.canvasHeight - self.heightPaddleSize
        # Round yRight to avoid float precision errors 
        self.yRight = self.l7sabat(self.yRight) 
        
        
class remotGameLogic:
    def __init__(self):
        # print('remote game logic initialized')
        self.canvasWidth = 1066
        self.canvasHeight = 640
        self.windowWidth = 0
        self.windowHeight = 0
        self.id = ''
        self.event = ''
        self.ball = {
            'x': 100,
            'y': 100,
            'vx': 5,
            'vy': 0,
            'radius': 25,
            'color': '#FF00E5',
            'speed': 5
        }
        self.xRight = 0
        self.xLeft = 0
        self.yRight = 0
        self.yLeft = 0
        self.heightPaddleSize = 0
        self.widthPaddleSize = 0
        self.keycontrol = False
        self.key = ''
        self.begin = True
        self.rightPlayerScore = 0
        self.leftPlayerScore = 0
        self.startTheGame = False
        self.fontsize = 0
        #edit this
        self.keepSending = True
        self.firstInstructions = True
        self.player1 = ''
        self.player2 = ''
        self.player1Move = False
        self.player2Move = False
        self.player1Key = {}
        self.player2Key = {}
        self.timer = True
        self.counting_down = False
        self.start_time = 0
        self.theCounter = 0
        self.winner = ''
        self.player1_Name = ''
        self.player2_Name = ''
        self.player1_level = ''
        self.player2_level = ''
        self.player1_total_wins = 0
        self.player2_total_wins = 0
        self.player1_token = ''
        self.player2_token = ''
        self.winner_xp = 0
        self.loser_xp = 0
        self.loserLevel = 0
        self.winnerLevel = 0
        
        
    def toJson(self):
        
        data = {
            'canvasWidth': self.l7sabat(self.canvasWidth),
            'canvasHeight': self.l7sabat(self.canvasHeight),
            'event': self.event,
            'ball': self.ball,
            'xRight': self.l7sabat(self.xRight),
            'xLeft': self.l7sabat(self.xLeft),
            'yRight': self.l7sabat(self.yRight),
            'yLeft': self.l7sabat(self.yLeft),
            'heightPaddleSize': self.l7sabat(self.heightPaddleSize),
            'widthPaddleSize': self.l7sabat(self.widthPaddleSize),
            'leftPlayerScore': self.leftPlayerScore,
            'rightPlayerScore': self.rightPlayerScore,
            'startTheGame': self.startTheGame,
            'fontSize': self.l7sabat(self.fontsize),
            'firstInstructions': self.firstInstructions,
            'startTheGame': self.startTheGame,
            'theCounter': int(self.theCounter),
            'winner': self.winner,
            'player1': self.player1,
            'player1_Name': self.player1_Name,
            'player2': self.player2,
            'player2_Name': self.player2_Name,
            
            
            
        }
        return data
    
    def l7sabat(self, num):
        return round(float(num), 2)
    
    def windowSize(self, jsondata):
        if(jsondata.get('width')):
            self.windowWidth = jsondata['width']
        if(jsondata.get('height')):
            self.windowHeight = jsondata['height']
            
    def parsMove(self, jsonData ):
        player_id = jsonData.get('id')
        
        # Get the key data
        key_data = jsonData.get('key', {})
        
        # If the key is a string (e.g., 'ArrowUp'), convert it to a dictionary
        if isinstance(key_data, str):
            key_data = {key_data: True}
        
        # Ensure each player has its own movement key state
        if player_id == self.player1:
            self.player1Move = True
            self.player1Key = key_data  # Store keys separately for player 1
        elif player_id == self.player2:
            self.player2Move = True
            self.player2Key = key_data  # Store keys separately for player 2
        print(f"Player 1 Key: {self.player1Key}")
        print(f"Player 2 Key: {self.player2Key}")

        # Check if any key is pressed for both players to set keycontrol
        self.keycontrol = any(self.player1Key.values()) or any(self.player2Key.values())
        print("keycontrole",self.keycontrol)
        # Reset movement flags if no keys are pressed
        if not any(self.player1Key.values()):
            self.player1Move = False
        if not any(self.player2Key.values()):
            self.player2Move = False
    
    
    def increaseLevelWiner(self, level, games_played):
        required_games_for_current_level = sum(i for i in range(1, int(level) + 1))
        required_games_for_next_level = sum(i for i in range(1, int(level) + 2))

        if games_played >= required_games_for_next_level:
            level = int(level) + 1
            print(f"Level up! You are now level {level}.")
        else:
            progress_within_level = (games_played - required_games_for_current_level) / (
                required_games_for_next_level - required_games_for_current_level
            )
            level = int(level) + progress_within_level
            print(f"Current progress: Level {level:.1f}.")

        return level
    # def increaseLevelLoser(self, level, games_played):
    #     effective_games_played = games_played * 0.15

    #     required_games_for_current_level = sum(i for i in range(1, int(level) + 1))
    #     required_games_for_next_level = sum(i for i in range(1, int(level) + 2))

    #     if effective_games_played >= required_games_for_next_level:
    #         level = int(level) + 1
    #         print(f"Level up (loser)! You are now level {level}.")
    #     else:
    #         progress_within_level = (effective_games_played - required_games_for_current_level) / (
    #             required_games_for_next_level - required_games_for_current_level
    #         )
    #         level = int(level) + progress_within_level
    #         print(f"Current progress (loser): Level {level:.1f}.")

    #     return level
    
    def xpcount(self,games_played, is_winner):
        if is_winner:
            return games_played * 2  # Winners gain 2 XP per game
        else:
            return games_played * 0.5  # Losers gain 0.5 XP per game
        pass

    def calculate_level(self,xp):

        level = 0
        required_xp = 0
        while xp >= required_xp:
            level += 1
            required_xp += level  # Level 1 requires 1 XP, Level 2 requires 2 XP, etc.
        return level - 1  # Subtract 1 because we incremented one extra in the loop
    
    
    def post_result(self, result,token, level,id,score,opponent_name,opponent_score):
        url = f"http://web:8000/api/profile/update/{result}/"
        headers = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        print("id1: ", id)
        data = {
            'level': level,
            'user_id': id,
            'score': score,
            'opponent_name': opponent_name,
            'opponent_score': opponent_score
        }
        response = requests.post(url, headers=headers, data=data)
        try:
            if(response.status_code == 200):
                print('result sent to database')
                print(response.json())
            else:
                print('error sending result to database')
                print(response.json())
        except requests.exceptions.ConnectionError as e:
            print(f"Connection error occurred: {e}")
        except requests.exceptions.Timeout as e:
            print(f"Timeout error occurred: {e}")
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
    def sendResultDataBase(self,winner):
        print('sending result to database')
        if(winner == "left"):
            self.player1_total_wins += 1
            self.player2_total_wins += 1
            print('player 1 total wins: ', self.player1_total_wins)
            print('player 2 total wins: ', self.player2_total_wins)
            # self.winner_xp = self.xpcount(self.player1_total_wins, True)
            # self.winnerLevel = self.calculate_level(self.winner_xp)
            self.winnerLevel = self.increaseLevelWiner(self.player1_level , self.player1_total_wins)
            # self.loser_xp = self.xpcount(self.player2_total_wins, False)
            self.loserLevel = self.player2_level + 0.15
            
            self.winnerLevel = self.l7sabat(self.winnerLevel)
            self.loserLevel = self.l7sabat(self.loserLevel)
            # loserLevel = self.increaseLevelLoser(self.player2_total_wins)
            print('player1 level9999: ', self.player1_level)
            self.post_result('win', self.player1_token, self.winnerLevel, self.player1, self.leftPlayerScore, self.player2_Name, self.rightPlayerScore)
            self.post_result('lose', self.player2_token, self.loserLevel, self.player2, self.rightPlayerScore, self.player1_Name, self.leftPlayerScore)
        elif (winner == "right"):
            self.player2_total_wins += 1
            self.player1_total_wins += 1
            print('player 1 total wins: ', self.player1_total_wins)
            print('player 2 total wins: ', self.player2_total_wins)
            # self.winner_xp = self.xpcount(self.player2_total_wins, True)
            # self.winnerLevel = self.calculate_level(self.winner_xp)
            # self.loser_xp = self.xpcount(self.player1_total_wins, False)
            
            self.loserLevel = self.player1_level + 0.15
            self.winnerLevel = self.increaseLevelWiner(self.player2_level, self.player2_total_wins)
            self.winnerLevel = self.l7sabat(self.winnerLevel)
            self.loserLevel = self.l7sabat(self.loserLevel)
            # loserLevel = self.increaseLevelLoser(self.player1_total_wins)
            self.post_result('win', self.player2_token, self.winnerLevel, self.player2, self.rightPlayerScore, self.player1_Name, self.leftPlayerScore)
            self.post_result('lose', self.player1_token, self.loserLevel, self.player1, self.leftPlayerScore, self.player2_Name, self.rightPlayerScore)
            
        else:
            if winner == self.player1_Name:
                self.player1_total_wins += 1
                self.player2_total_wins += 1
                print('player 1 total wins: ', self.player1_total_wins)
                print('player 2 total wins: ', self.player2_total_wins)
                # self.winner_xp = self.xpcount(self.player1_total_wins, True)
                # self.winnerLevel = self.calculate_level(self.winner_xp)
                # self.loser_xp = self.xpcount(self.player2_total_wins, False)
                self.loserLevel = self.player2_level + 0.15
                self.winnerLevel = self.increaseLevelWiner(self.player1_level, self.player1_total_wins)
                
                self.winnerLevel = self.l7sabat(self.winnerLevel)
                self.loserLevel = self.l7sabat(self.loserLevel)
                # loserLevel = self.increaseLevelLoser(self.player2_total_wins)
                self.post_result('win', self.player1_token, self.winnerLevel, self.player1 , self.leftPlayerScore, self.player2_Name, self.rightPlayerScore)
                self.post_result('lose', self.player2_token, self.loserLevel, self.player2, self.rightPlayerScore, self.player1_Name, self.leftPlayerScore)
            elif winner == self.player2_Name:
                self.player2_total_wins += 1
                self.player1_total_wins += 1
                print('player 1 total wins: ', self.player1_total_wins)
                print('player 2 total wins: ', self.player2_total_wins)
                # self.winner_xp = self.xpcount(self.player2_total_wins, True)
                # self.winnerLevel = self.calculate_level(self.winner_xp)
                # self.loser_xp = self.xpcount(self.player1_total_wins, False)
                self.loserLevel = self.player1_level + 0.15
                self.winnerLevel = self.increaseLevelWiner(self.player2_level, self.player2_total_wins)
                self.winnerLevel = self.l7sabat(self.winnerLevel)
                self.loserLevel = self.l7sabat(self.loserLevel)
                # loserLevel = self.increaseLevelLoser(self.player1_total_wins)
                self.post_result('win', self.player2_token, self.winnerLevel, self.player2, self.rightPlayerScore, self.player1_Name, self.leftPlayerScore)
                self.post_result('lose', self.player1_token, self.loserLevel, self.player1, self.leftPlayerScore, self.player2_Name, self.rightPlayerScore)
    
    def calculation(self):
        if(self.begin):
            if(self.leftPlayerScore == 4 or self.rightPlayerScore == 4):
                self.event = 'gameOver'
                self.winner = 'left' if self.leftPlayerScore == 4 else 'right'
                self.keepSending = False
                self.sendResultDataBase(self.winner)
                return
            if(self.timer):
                 self.startCountdown()
            
            self.heightPaddleSize = self.canvasHeight / 6
            self.widthPaddleSize = self.canvasWidth * 0.02
            self.fontsize = self.canvasHeight * 0.06
            self.xRight = self.canvasWidth - self.canvasWidth * 0.02
            self.yRight = self.canvasHeight / 2 - self.heightPaddleSize / 2
            self.xLeft = 0
            self.yLeft = self.canvasHeight / 2 - self.heightPaddleSize / 2
            self.ball['x'] = self.canvasWidth / 2
            self.ball['y'] = self.canvasHeight / 2
            self.ball['radius'] = self.canvasHeight / 50
            random_value = random.choice([-1, 1])
            self.ball['vx'] = random_value * self.canvasHeight / 200
            random_value = random.choice([0,0.3,0.2,0.1])
            self.ball['vy'] = random_value * self.canvasHeight / 200
            self.ball['speed'] = self.canvasHeight / 200
            self.begin = False
            # self.startTheGame = False
        elif(self.startTheGame):
            self.ball['x'] += self.ball['vx']
            self.ball['y'] += self.ball['vy']
            # ball collision with top and bottom walls
            if(self.ball['y'] + self.ball['vy'] > self.canvasHeight - self.ball['radius'] or self.ball['y'] + self.ball['vy'] < self.ball['radius']):
                self.ball['vy'] = -self.ball['vy']
            #ball collision with left and right walls 
            if(self.ball['x'] + self.ball['vx'] > self.canvasWidth - self.ball['radius'] or self.ball['x'] + self.ball['vx'] < self.ball['radius']):
                if(self.ball['x'] + self.ball['vx'] > self.canvasWidth - self.ball['radius']):
                    self.leftPlayerScore += 1
                    # print('right player score: ', self.rightPlayerScore)
                if(self.ball['x'] + self.ball['vx'] < self.ball['radius']):
                    self.rightPlayerScore += 1
                    # print('left player score: ', self.leftPlayerScore)
                self.begin = True
                return
            #ball collision with the left paddle
            if(self.ball['x'] - self.ball['radius'] < self.xLeft + self.canvasWidth * 0.02 and 
               self.ball['y'] + self.ball['radius'] > self.yLeft and 
               self.ball['y'] - self.ball['radius'] < self.yLeft + self.canvasHeight / 6):
                relY = self.ball['y'] - (self.yLeft + self.canvasHeight / 6 / 2)
                angle = relY / (self.canvasHeight / 6 / 2)
                self.ball['vx'] = abs(self.ball['vx'])
                self.ball['vy'] += angle * 2
                #prevent the ball from getting stuck inside the racket
                self.ball['x'] = self.xLeft + self.canvasWidth * 0.02 + self.ball['radius']
                #limit the y velocity
                if(self.ball['vy'] > self.ball['speed']):
                    self.ball['vy'] = self.ball['speed']
                elif(self.ball['vy'] < -self.ball['speed']):
                    self.ball['vy'] = -self.ball['speed']
            #ball collision with the right paddle
            if(self.ball['x'] + self.ball['radius'] > self.xRight and 
               self.ball['y'] + self.ball['radius'] > self.yRight and 
               self.ball['y'] - self.ball['radius'] < self.yRight + self.canvasHeight / 6):
                relY = self.ball['y'] - (self.yRight + self.canvasHeight / 6 / 2)
                angle = relY / (self.canvasHeight / 6 / 2)
                self.ball['vx'] = -abs(self.ball['vx'])
                self.ball['vy'] += angle * 2
                #prevent the ball from getting stuck inside the racket
                self.ball['x'] = self.xRight - self.ball['radius']
                #limit the y velocity
                if(self.ball['vy'] > self.ball['speed']):
                    self.ball['vy'] = self.ball['speed']
                elif(self.ball['vy'] < -self.ball['speed']):
                    self.ball['vy'] = -self.ball['speed']
                    
        if(self.keycontrol):
            self.handlingMovement()
        self.countToTree()
        
    
    def handlingMovement(self):
        # if(self.key == ''):
        #     return
        if(self.player1Move):
            if(self.player1Key.get('ArrowUp')):
                if(self.yLeft > 0):
                    self.yLeft -= self.canvasHeight / 200
                if(self.yLeft < 0):
                    self.yLeft = 0
            if(self.player1Key.get('ArrowDown')):
                if(self.yLeft < self.canvasHeight - self.canvasHeight / 6):
                    self.yLeft += self.canvasHeight / 200
                if(self.yLeft > self.canvasHeight - self.canvasHeight / 6):
                    self.yLeft = self.canvasHeight - self.canvasHeight / 6
            # self.player1Move = False
        if(self.player2Move):
            if(self.player2Key.get('ArrowUp')):
                if(self.yRight > 0):
                    self.yRight -= self.canvasHeight / 200
                if(self.yRight < 0):
                    self.yRight = 0
            if(self.player2Key.get('ArrowDown')):
                if(self.yRight < self.canvasHeight - self.canvasHeight / 6):
                    self.yRight += self.canvasHeight / 200
                if(self.yRight > self.canvasHeight - self.canvasHeight / 6):
                    self.yRight = self.canvasHeight - self.canvasHeight / 6
            # self.player2Move = False
    def startCountdown(self):
        self.start_time = time.time()  # Store the current time
        self.counting_down = True
        self.timer = False
    def countToTree(self):
        if self.counting_down:
            elapsed_time = time.time() - self.start_time
            if elapsed_time >= 4:
                self.startTheGame = True
                self.counting_down = False
                self.theCounter = elapsed_time
            elif elapsed_time >= 2:
                self.firstInstructions = False
                self.theCounter = elapsed_time
            elif elapsed_time >= 1:
                self.theCounter = elapsed_time
            elif elapsed_time >= 0:
                self.theCounter = elapsed_time
                
                
                