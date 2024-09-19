// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract TournamentManager {
    // events
    event ScoresUpdated(int8 tournamentId, address player, uint wins, uint losses);
    event TournamentCreated();
    event PlayerRegistred(int8 indexed tournamentIds, address indexed player);

    // player Struct
    struct PlayerScores {
        uint8 wins;
        uint8 losses;
    }

    // tournament Struct
    struct Tournament {
        int8 id;
        bool isOpen;
    }

    // mapping TournamentId and the addresses of players registred
    mapping(int8 tournamentId => address[]) public playersRegistred;
    mapping(int8 => mapping(address => bool)) public playerschecks;

    // mapping tournament id and the player's scores in that specific tournament
    mapping(int8 tournamentId => mapping(address => PlayerScores)) playerScores;

    // array of tournaments
    Tournament[] public tournament;

    int8 public tournamentId = -1;

    // create tournament
    function createTournament() public {
        tournamentId++;
        tournament.push(Tournament(tournamentId, true));
        emit TournamentCreated();
    }

    // addp players to the tournament
    function registerForTournament(address player) public {
        require(tournament[uint8(tournamentId)].isOpen, "Tournament is not open yet");
        require(!playerschecks[tournamentId][msg.sender], "You are already registred"); //I should check if the player is already registred or not
        playersRegistred[tournamentId].push(msg.sender);
        playerschecks[tournamentId][msg.sender] = true;
        emit PlayerRegistred(tournamentId, player);
    }

    // when player won a match
    function playerWon(address player) public {
        playerScores[tournamentId][player].wins++;
        emit ScoresUpdated(tournamentId, player, playerScores[tournamentId][player].wins, playerScores[tournamentId][player].losses);
    }

    // when player loses a match
    function playerLoss(address player) public {
        playerScores[tournamentId][player].losses++;
        emit ScoresUpdated(tournamentId, player, playerScores[tournamentId][player].wins, playerScores[tournamentId][player].losses);
    }

    // player's score in a certain tournament
    function getPlayerScore(int8 tournamentIds, address player) public view returns (uint8 wins, uint8 losses){
        return (playerScores[tournamentIds][player].wins, playerScores[tournamentIds][player].losses);
    }

    // all players registred in a tournament
    function getNumberOfPlayersRegistred(int8 tournamentIds) public view returns (uint) {
        return playersRegistred[tournamentIds].length;
    }

    // get all player addresses, their wins and losses in that specific tournament
    function getTournamentAllData(int8 tournamentIds) public view returns (address[] memory players, uint256[] memory wins, uint256[] memory losses) {
        mapping(address => PlayerScores) storage scores = playerScores[tournamentIds];

        uint length = getNumberOfPlayersRegistred(tournamentIds);

        players = new address[](length);
        wins = new uint[](length);
        losses = new uint[](length);

        uint8 index = 0;
        for (index; index < length;) {
            address playerAddr = playersRegistred[tournamentIds][index];
            players[index] = playerAddr;
            wins[index] = scores[playerAddr].wins;
            losses[index] = scores[playerAddr].losses;
            index++;
        }

        return (players, wins, losses);
    }

    // getting all the player's wins
    function getPlayerAllWinsCumulated(address player) public view returns(uint256 wins) {
        for (int8 index = 0; index <= tournamentId; index++) {
            wins += playerScores[index][player].wins;
        }
    }

    // getting all the player's losses
    function getPlayerAllLossesCumulated(address player) public view returns(uint256 losses) {
        for (int8 index = 0; index <= tournamentId; index++) {
            losses += playerScores[index][player].losses;
        }
    }

    // getting all the player's wins on a specific tournament
    function getPlayerWinsOnACertainTournament(int8 tournamentIds, address player) public view returns(uint256 wins) {
        wins += playerScores[tournamentIds][player].wins;
    }

    // getting all the player's losses on a specific tournament
    function getPlayerLossesOnACertainTournament(int8 tournamentIds, address player) public view returns(uint256 losses) {
        losses += playerScores[tournamentIds][player].losses;
    }

    function ifAddressIsRegistredInTournament(int8 tournamentIds, address player) public view returns(bool condition) {
        condition = playerschecks[tournamentIds][player];
    }
}
