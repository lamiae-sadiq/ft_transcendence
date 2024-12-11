from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import FriendRequest
from django.contrib.auth.models import User

class SendFriendRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, nickname):
        try:
            from_user = request.user
            to_user = get_object_or_404(User, user_profile__nickname=nickname)

            if from_user == to_user:
                return Response({'error': 'You cannot send a friend request to yourself.'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if a friend request already exists
            if FriendRequest.objects.filter(from_user=from_user, to_user=to_user).exists():
                return Response({'error': 'Friend request already sent.'}, status=status.HTTP_400_BAD_REQUEST)
            
            FriendRequest.objects.create(from_user=from_user, to_user=to_user)
            return Response({'message': 'Friend request sent successfully.'}, status=status.HTTP_200_OK)

        except Exception as e:
            # Catch any unexpected errors and return a JSON response
            return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AcceptFriendRequest(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, nickname):
        friend_request = get_object_or_404(FriendRequest, to_user=request.user, from_user__user_profile__nickname=nickname)
        
        # Add the users as friends
        friend_request.from_user.user_profile.friends.add(friend_request.to_user)
        friend_request.to_user.user_profile.friends.add(friend_request.from_user)
        friend_request.delete()
        
        return Response({'message': 'Friend request accepted.'}, status=status.HTTP_200_OK)

class CancelFriendRequest(APIView):
    def post(self, request, nickname):
        print(f"Nickname received: {nickname}")
        try:
            friend_request = FriendRequest.objects.get(to_user=request.user, from_user__user_profile__nickname=nickname )
            print(f"Friend request found: {friend_request}")
            friend_request.delete()
            return Response({'message': 'Friend request canceled.'}, status=status.HTTP_200_OK)
        except FriendRequest.DoesNotExist:
            print(f"No friend request found from {request.user.username} to {nickname}")
            return Response({'error': 'Friend request not found.'}, status=status.HTTP_404_NOT_FOUND)

class FriendRequests(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Retrieve all friend requests sent to the current user
        friend_requests = FriendRequest.objects.filter(to_user=request.user)
        requests_data = [{"nickname": fr.from_user.user_profile.nickname} for fr in friend_requests]
        return Response(requests_data)

# import logging

# logger = logging.getLogger(__name__)

class FriendListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_profile = getattr(request.user, 'user_profile', None)
            if not user_profile:
                raise AttributeError("User profile not found")
            
            # logger.info(f"UserProfile found for user: {request.user.username}")
            
            friends = user_profile.friends.all()
            friends_data = [
                {
                    "id": friend.id,
                    "nickname": getattr(friend.user_profile, 'nickname', ''),
                    "profile_picture": (
                        friend.user_profile.profile_picture.url
                        if getattr(friend.user_profile, 'profile_picture', None) else ""
                    ),
                    "bio": getattr(friend.user_profile, 'bio', ''),
                }
                for friend in friends
            ]

            # logger.info(f"Friends data: {friends_data}")
            return Response(friends_data, status=status.HTTP_200_OK)

        except Exception as e:
            # logger.error(f"Error in FriendListView: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
