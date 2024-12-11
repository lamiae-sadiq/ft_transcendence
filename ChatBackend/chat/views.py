from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.models import User
from .models import ChatRoom, Message
from rest_framework.permissions import IsAuthenticated
from .serializers import ChatRoomSerializer, MessageSerializer



# class CreateRoom(APIView):
#     def post(self, request, *args, **kwargs):
#         room_name = request.data.get('room_name')
#         users = request.data.get('users', [])

#         # Create a room and link users (simplified)
#         room = ChatRoom.objects.create(name=room_name)
#         for user_id in users:
#             user = User.objects.get(id=user_id)
#             room.users.add(user)

#         room.save()
#         return Response(ChatRoomSerializer(room).data)

class ChatRoomView(APIView):
    def get(self, request, room_name):
        room = get_object_or_404(ChatRoom, name=room_name)
        serializer = ChatRoomSerializer(room)
        return Response(serializer.data)

    def post(self, request):
        serializer = ChatRoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, friend_id):
        try:
            user = request.user
            friend = User.objects.get(id=friend_id)
            
            # Filter messages between the authenticated user and the friend
            messages = Message.objects.filter(
                (Q(sender=user) & Q(receiver=friend)) | (Q(sender=friend) & Q(receiver=user))
            ).order_by('timestamp')

            # Serialize the messages
            serialized_messages = [
                {
                    "id": message.id,
                    "sender": message.sender.username,
                    "receiver": message.receiver.username,
                    "content": message.content,
                    "timestamp": message.timestamp.isoformat(),
                }
                for message in messages
            ]
            return Response(serialized_messages, status=200)

        except User.DoesNotExist:
            return Response({"error": "Friend not found."}, status=404)

        except Exception as e:
            return Response({"error": str(e)}, status=500)