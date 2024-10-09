from django.urls import path
from .views import (create_tournament, record_match, 
                    get_all_matches_played_by_player,
                    get_player_stats,
                    get_tournament_matches)


urlpatterns = [
    path('create-tournament/', create_tournament, name='create_tournament'),
    path('record-match/', record_match, name='record_match'),
    path('tournament-matches/', get_tournament_matches, name='tournament_matches'),
    path('player-stats/', get_player_stats, name='player_stats'),
    path('player-matches/', get_all_matches_played_by_player, name='player_matches'),
]