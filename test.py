# def calculate_next_level(level, games_played):
#     """
#     Calculate the player's level based on the games played.
#     Each level requires progressively more games:
#     - Level 1: 1 game
#     - Level 2: 3 games
#     - Level 3: 6 games
#     - Level 4: 10 games, and so on.
#     """
#     # Calculate total games required to reach the current level
#     required_games_for_current_level = sum(i for i in range(1, int(level) + 1))
#     required_games_for_next_level = sum(i for i in range(1, int(level) + 2))

#     if games_played >= required_games_for_next_level:
#         # Level up if enough games are played
#         level = int(level) + 1
#         print(f"Level up! You are now level {level}.")
#     else:
#         # Calculate fractional progress within the current level
#         progress_within_level = (games_played - required_games_for_current_level) / (
#             required_games_for_next_level - required_games_for_current_level
#         )
#         level = int(level) + progress_within_level
#         print(f"Current progress: Level {level:.1f}.")

#     return level

# # Example usage
# # level = 0
# # games_played = 0

# # # Simulate playing games
# # for i in range(100):  # Simulate playing 15 games
# #     games_played += 1
# #     level = calculate_next_level(level, games_played)

# def calculate_next_level_loser(level, games_played):
#     """
#     Calculate the player's level based on games played for a loser.
#     Each level requires progressively more games, but progress is slower (e.g., 50% of a winner's points):
#     - Level 1: 1 game
#     - Level 2: 3 games
#     - Level 3: 6 games
#     - Level 4: 10 games, and so on.
#     """
#     # Calculate total games required to reach the current level
#     required_games_for_current_level = sum(i for i in range(1, int(level) + 1))
#     required_games_for_next_level = sum(i for i in range(1, int(level) + 2))

#     if games_played >= required_games_for_next_level:
#         # Level up if enough games are played
#         level = int(level) + 1
#         print(f"Level up (loser)! You are now level {level}.")
#     else:
#         # Calculate fractional progress within the current level
#         progress_within_level = (games_played - required_games_for_current_level) / (
#             required_games_for_next_level - required_games_for_current_level
#         )
#         # Reduce the fractional progress for losers (e.g., by 50%)
#         progress_within_level *= 0.5  # Adjust the factor for reduced progress
#         level = int(level) + progress_within_level
#         print(f"Current progress (loser): Level {level:.1f}.")

#     return level

# # Example usage for winners and losers
# def simulate_game_results():
#     winner_level = 0
#     loser_level = 0
#     games_played = 0

#     # Simulate 15 games
#     for i in range(15):
#         games_played += 1
#         print(f"\nGame {i + 1}:")
#         # Update winner's level
#         winner_level = calculate_next_level(winner_level, games_played)
#         # Update loser's level
#         loser_level = calculate_next_level_loser(loser_level, games_played)

# # Run simulation
# simulate_game_results()

def calculate_next_level(level, games_played):
    """
    Calculate the player's level based on games played as a winner.
    Winning increases progress faster.
    """
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


def calculate_next_level_loser(level, games_played):
    """
    Calculate the player's level based on games played as a loser.
    Losing increases progress more slowly (e.g., at 50% efficiency).
    """
    # Scale down "games played" for losers to ensure slower progression.
    effective_games_played = games_played * 0.25

    required_games_for_current_level = sum(i for i in range(1, int(level) + 1))
    required_games_for_next_level = sum(i for i in range(1, int(level) + 2))

    if effective_games_played >= required_games_for_next_level:
        level = int(level) + 1
        print(f"Level up (loser)! You are now level {level}.")
    else:
        progress_within_level = (effective_games_played - required_games_for_current_level) / (
            required_games_for_next_level - required_games_for_current_level
        )
        level = int(level) + progress_within_level
        print(f"Current progress (loser): Level {level:.1f}.")

    return level


# Simulate games for winners and losers
def simulate_game_results():
    winner_level = 0
    loser_level = 0
    winner_games_played = 0
    loser_games_played = 0

    # Simulate 15 games
    for i in range(15):
        print(f"\nGame {i + 1}:")
        # Winner plays a game and levels up
        winner_games_played += 1
        winner_level = calculate_next_level(winner_level, winner_games_played)

        # Loser plays a game and levels up more slowly
        loser_games_played += 1
        loser_level = calculate_next_level_loser(loser_level, loser_games_played)


# Run the simulation
simulate_game_results()

