import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.contrib.auth.models import User
from .models import ChatRoom, Message
import logging

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"

        # Add this connection to the group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        logger.info(f"WebSocket connected: {self.room_group_name}")
        logger.info(f"Connecting to room: {self.room_name}")

    async def disconnect(self, close_code):
        # Remove this connection from the group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        logger.info(f"WebSocket disconnected: {self.room_group_name}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            logger.info(f"Received WebSocket data: {data}")

            message = data.get("message")
            username = data.get("username")

            if not message or not username:
                await self.send(
                    text_data=json.dumps({"error": "Invalid message format"})
                )
                logger.error("Invalid message format received.")
                return

            # Save the message to the database
            await self.save_message(username, message)

            # Broadcast the message to the group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "username": username,
                    "timestamp": data.get("timestamp"),
                },
            )
        except Exception as e:
            logger.error(f"Error in receive: {e}")
            await self.send(
                text_data=json.dumps({"error": f"Server error: {str(e)}"})
            )

    async def chat_message(self, event):
        logger.info(f"Broadcasting message: {event}")
        await self.send(
            text_data=json.dumps(
                {
                    "message": event["message"],
                    "username": event["username"],
                    "timestamp": event["timestamp"],
                }
            )
        )

    @sync_to_async
    def save_message(self, username, message):
        try:
            # Fetch the sender
            logger.error("saaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaave");
            sender = User.objects.get(username=username)

            # Extract the receiver's ID from the room_name
            room_parts = self.room_name.split("_")
            receiver_id = room_parts[1]  # Assuming `room_name` format is `chat_<sender_username>_<receiver_id>`

            # Fetch the receiver using the ID
            receiver = User.objects.get(id=receiver_id)

            logger.info(f"Room name: {self.room_name}")
            logger.info(f"Sender username: {username}")
            logger.info(f"Receiver ID: {receiver_id}")
            # Create or get the chat room
            logger.error("saaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaave2");
            chat_room, _ = ChatRoom.objects.get_or_create(name=self.room_name)

            # Save the message

            logger.error("saaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaave3");
            return Message.objects.create(
                chat_room=chat_room, sender=sender, receiver=receiver, content=message
            )
        except User.DoesNotExist as e:
            logger.error(f"User does not exist: {e}")
            raise
        except Exception as e:
            logger.error(f"Error saving message: {e}")
            raise
