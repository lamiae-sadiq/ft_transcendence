from django.urls import path
from .views import (
    SendFriendRequest,
    AcceptFriendRequest,
    CancelFriendRequest,
    FriendRequests,
    FriendListView,
)

urlpatterns = [
    path('send-friend-request/<str:nickname>/', SendFriendRequest.as_view(), name='send-friend-request'),
    path('accept-friend-request/<str:nickname>/', AcceptFriendRequest.as_view(), name='accept-friend-request'),
    path('cancel-friend-request/<str:nickname>/', CancelFriendRequest.as_view(), name='cancel-friend-request'),
    path('friend-requests/', FriendRequests.as_view(), name='friend-requests'),
    path('friend-list/', FriendListView.as_view(), name="friend-list"),
]