from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import FriendRequest
from django.contrib.auth.models import User

class SendFriendRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, nickname):
        from_user = request.user
        to_user = get_object_or_404(User, user_profile__nickname=nickname)
        
        if from_user == to_user:
            return Response({'error': 'You cannot send a friend request to yourself.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if a friend request already exists
        if FriendRequest.objects.filter(from_user=from_user, to_user=to_user).exists():
            return Response({'error': 'Friend request already sent.'}, status=status.HTTP_400_BAD_REQUEST)
        
        FriendRequest.objects.create(from_user=from_user, to_user=to_user)
        return Response({'message': 'Friend request sent.'}, status=status.HTTP_200_OK)

class AcceptFriendRequest(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, nickname):
        friend_request = get_object_or_404(FriendRequest, to_user=request.user, from_user__user_profile__nickname=nickname)
        
        # Add the users as friends
        friend_request.from_user.user_profile.friends.add(friend_request.to_user)
        friend_request.to_user.user_profile.friends.add(friend_request.from_user)
        friend_request.delete()
        
        return Response({'message': 'Friend request accepted.'}, status=status.HTTP_200_OK)
