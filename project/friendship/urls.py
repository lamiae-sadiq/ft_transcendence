from django.urls import path
from .views import SendFriendRequest, AcceptFriendRequest

urlpatterns = [
    path('send-request/<str:nickname>/', SendFriendRequest.as_view(), name='send-friend-request'),
    path('accept-request/<str:nickname>/', AcceptFriendRequest.as_view(), name='accept-friend-request'),
]
