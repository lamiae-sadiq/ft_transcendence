// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract LocalTournament {
    event tournamentCreated(uint tournamentId);
    event matchRecorded();
    uint8 MATCHPERTOURNAMENT = 3;
    // Structure to represent each match
    struct Match {
        string player1; // name
        string player2; // name
        uint player1Score;
        uint player2Score;
        string winner; // Winner's name
    }

    // Structure to represent each tournament
    struct Tournament {
        uint tournamentId;
        Match[3] matches; // List of matches in the tournament
        uint currentMatchCount; // Keep track of how many matches have been added
    }

    // Player cumulative stats across tournaments
    struct PlayerStats {
        uint totalWins;
        uint totalLosses;
        uint totalScore;
    }

    // Mapping of player's name to their cumulative stats
    mapping(string => PlayerStats) public playerStats;

    // Mapping of tournament ID to tournament details
    mapping(uint => Tournament) public tournaments;

    // Counter to track tournament IDs
    uint8 public tournamentCounter;

    /**
     * @notice Creates a new tournament.
     */
    function createTournament() public returns (uint) {
        Tournament storage tournament = tournaments[tournamentCounter]; // SLOAD once
        tournament.tournamentId = tournamentCounter++;
        tournament.currentMatchCount = 0;

        emit tournamentCreated(tournament.tournamentId);
        return tournament.tournamentId;
    }

    /**
     * @notice Records the result of a match in a tournament.
     * @param _tournamentId The ID of the tournament.
     * @param _player1 The name of player 1.
     * @param _player2 The name of player 2.
     * @param _player1Score The score of player 1.
     * @param _player2Score The score of player 2.
     */
    function recordMatch(
        uint _tournamentId,
        string memory _player1,
        string memory _player2,
        uint _player1Score,
        uint _player2Score
    ) public {
        Tournament storage tournament = tournaments[_tournamentId];
        PlayerStats storage playerStates1 = playerStats[_player1];
        PlayerStats storage playerStates2 = playerStats[_player2];
        require(
            _tournamentId >= 0 && _tournamentId <= tournamentCounter,
            "Invalid tournament ID"
        );
        require(
            tournament.currentMatchCount < MATCHPERTOURNAMENT,
            "Maximum matches reached"
        );

        // Determine the winner
        string memory _winner;
        if (_player1Score > _player2Score) {
            _winner = _player1;
            playerStates1.totalWins++;
            playerStates2.totalLosses++;
        } else {
            _winner = _player2;
            playerStates2.totalWins++;
            playerStates1.totalLosses++;
        }

        // Update cumulative scores
        playerStates1.totalScore += _player1Score;
        playerStates2.totalScore += _player2Score;

        // Create a new match
        Match memory newMatch = Match({
            player1: _player1,
            player2: _player2,
            player1Score: _player1Score,
            player2Score: _player2Score,
            winner: _winner
        });

        // Add the match to the tournament
        tournament.matches[tournament.currentMatchCount] = newMatch;
        tournament.currentMatchCount++;
        emit matchRecorded();
    }

    /**
     * @notice Returns all matches in a tournament.
     * @param _tournamentId The ID of the tournament.
     * @return An array of matches.
     */
    function getTournamentMatches(
        uint _tournamentId
    ) public view returns (Match[] memory) {
        require(
            _tournamentId >= 0 && _tournamentId <= tournamentCounter,
            "Invalid tournament ID"
        );
        uint matchCount = tournaments[_tournamentId].currentMatchCount;
        Tournament memory tournament = tournaments[_tournamentId];
        Match[] memory matchesPlayed = new Match[](matchCount);
        for (uint i = 0; i <= matchCount; i++) {
            matchesPlayed[i] = tournament.matches[i];
        }
        return matchesPlayed;
    }

    /**
     * @notice Returns the cumulative stats of a player.
     * @param _playerId The name of the player.
     * @return The player's total wins, total losses, and total score.
     */
    function getPlayerStats(
        string memory _playerId
    ) public view returns (uint, uint, uint) {
        PlayerStats memory stats = playerStats[_playerId];
        return (stats.totalWins, stats.totalLosses, stats.totalScore);
    }

    /**
     * @notice Returns all matches a player participated in.
     * @param _name The name of the player.
     * @return An array of matches the player participated in.
     */
    function getAllMatchesPlayedByThePlayer(
        string memory _name
    ) public view returns (Match[] memory) {
        // Calculate maximum possible matches
        uint8 maxMatches = tournamentCounter * MATCHPERTOURNAMENT; // Maximum matches a player could play
        Match[] memory allMatches = new Match[](maxMatches);
        uint8 matchCount = 0; // Count of matches the player participated in

        // Cache the hash of the player's name to avoid recalculating it
        bytes32 playerHash = keccak256(abi.encodePacked(_name));

        // Loop through all tournaments
        for (uint8 counter = 0; counter <= tournamentCounter; counter++) {
            Tournament storage tournament = tournaments[counter];
            // Loop through the 3 matches in each tournament
            for (
                uint8 cMatches = 0;
                cMatches < MATCHPERTOURNAMENT;
                cMatches++
            ) {
                // Check if the player participated in the match
                if (
                    playerHash ==
                    keccak256(
                        abi.encodePacked(tournament.matches[cMatches].player1)
                    ) ||
                    playerHash ==
                    keccak256(
                        abi.encodePacked(tournament.matches[cMatches].player2)
                    )
                ) {
                    // Store the match in the array
                    allMatches[matchCount++] = tournament.matches[cMatches];
                }
            }
        }

        // Create a new array to return only the relevant matches
        Match[] memory playerMatches = new Match[](matchCount);
        for (uint8 i = 0; i < matchCount; i++) {
            playerMatches[i] = allMatches[i];
        }

        return playerMatches; // Return the array of matches
    }
}
