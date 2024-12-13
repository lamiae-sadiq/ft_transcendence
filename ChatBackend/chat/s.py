# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
# from asgiref.sync import sync_to_async
# from django.contrib.auth.models import User
# from .models import ChatRoom, Message
# import logging

# logger = logging.getLogger(__name__)

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         self.room_group_name = f"chat_{self.room_name}"

#         logger.info(f"Connecting to room: {self.room_name}")
        
#         # Add this connection to the group
#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )

#         # Accept the WebSocket connection first
#         await self.accept()
#         logger.info(f"WebSocket connected: {self.room_group_name}")

#         # Fetch and send previous messages
#         try:
#             messages = await self.get_messages()
#             for message in messages:
#                 await self.send(text_data=json.dumps({
#                     "message": message["content"],
#                     "username": message["sender"],
#                     "timestamp": message["timestamp"],
#                 }))
#             logger.info(f"Sent previous messages to client: {self.room_name}")
#         except Exception as e:
#             logger.error(f"Error fetching or sending messages: {e}")

#     async def disconnect(self, close_code):
#         try:
#             # Remove this connection from the group
#             await self.channel_layer.group_discard(
#                 self.room_group_name,
#                 self.channel_name
#             )
#             logger.info(f"WebSocket disconnected: {self.room_group_name}")
#         except Exception as e:
#             logger.error(f"Error during WebSocket disconnection: {e}")

#     @sync_to_async
#     def get_messages(self):
#         try:
#             logger.info(f"Fetching messages for room: {self.room_name}")
            
#             # Fetch messages with the required fields
#             messages = Message.objects.filter(chat_room__name=self.room_name).order_by('timestamp')
            
#             logger.info(f"Fetched messages: {messages}")
            
#             # Convert messages to a list of dictionaries
#             message_list = [
#                 {
#                     "content": message.content,
#                     "sender": message.sender.username,  # Ensure sender is correctly accessed
#                     "timestamp": message.timestamp.isoformat(),
#                 }
#                 for message in messages
#             ]
#             logger.info(f"Message list prepared: {message_list}")
#             return message_list
#         except Exception as e:
#             logger.error(f"Error fetching messages: {e}")
#             return []

#     async def receive(self, text_data):
#         try:
#             data = json.loads(text_data)
#             logger.info(f"Received WebSocket data: {data}")  # Log the received data

#             message = data.get("message")
#             username = data.get("username")

#             if not message or not username:
#                 await self.send(
#                     text_data=json.dumps({"error": "Invalid message format"})
#                 )
#                 logger.error("Invalid message format received.")
#                 return

#             # Save the message to the database
#             await self.save_message(username, message)

#             # Broadcast the message to the group
#             await self.channel_layer.group_send(
#                 self.room_group_name,
#                 {
#                     "type": "chat_message",
#                     "message": message,
#                     "username": username,
#                     "timestamp": data.get("timestamp"),
#                 },
#             )
#         except Exception as e:
#             logger.error(f"Error in receive: {e}")
#             await self.send(
#                 text_data=json.dumps({"error": f"Server error: {str(e)}"})
#             )


#     async def chat_message(self, event):
#         try:
#             logger.info(f"Broadcasting message: {event}")
#             # Broadcast to all WebSocket connections in the room
#             await self.send(
#                 text_data=json.dumps(
#                     {
#                         "message": event["message"],
#                         "username": event["username"],
#                         "timestamp": event["timestamp"],
#                     }
#                 )
#             )
#         except Exception as e:
#             logger.error(f"Error broadcasting message: {e}")

#     @sync_to_async
#     def save_message(self, username, message):
#         try:
#             sender = User.objects.get(username=username)

#             # Extract the receiver's ID from the room_name
#             room_parts = self.room_name.split("_")
#             receiver_id = int(room_parts[1])  # Assuming room_name is formatted as sender_receiver

#             # Fetch the receiver using the ID
#             receiver = User.objects.get(id=receiver_id)

#             logger.info(f"Room name: {self.room_name}")
#             logger.info(f"Sender username: {username}")
#             logger.info(f"Receiver ID: {receiver_id}")

#             # Create or get the chat room
#             chat_room, _ = ChatRoom.objects.get_or_create(name=self.room_name)

#             # Save the message to the database
#             return Message.objects.create(
#                 chat_room=chat_room, sender=sender, receiver=receiver, content=message
#             )
#         except User.DoesNotExist as e:
#             logger.error(f"User does not exist: {e}")
#             raise
#         except Exception as e:
#             logger.error(f"Error saving message: {e}")
#             raise
