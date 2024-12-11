from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    #local game
    re_path(r'ws/pingPong/local', consumers.pingPongConsumer.as_asgi() , {'game_type': 'local'}),
    #remote game
    re_path(r'ws/pingPong/remote', consumers.pingPongConsumer.as_asgi() , {'game_type': 'remote'}),
    re_path(r'ws/pingPong/tournament', consumers.pingPongConsumer.as_asgi() , {'game_type': 'tournament'}),
    # re_path(r'ws/pingPong/tournament',consumers.pingPongConsumerTournament.as_asgi()),
]