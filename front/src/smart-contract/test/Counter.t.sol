// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Test, console} from "../lib/forge-std/src/Test.sol";
import {TournamentManager} from "../src/TournamentManager.sol";
import {DeploySmartContract} from "../script/DeploySmartContract.s.sol";

contract testing is Test {
    DeploySmartContract deploySmartContract;
    TournamentManager tournamentManager;

    address public player = makeAddr("player");

    function setUp() external {
        deploySmartContract = new DeploySmartContract();
        tournamentManager = deploySmartContract.run();
    }

    function testregisterForTournament() external {
        // tournamentManager.tournamentId();
        int8 zero = 0;
        vm.startPrank(player);
        tournamentManager.createTournament();
        tournamentManager.registerForTournament(player);
        assert(tournamentManager.tournamentId() == zero);
        bool checkStatus = tournamentManager.ifAddressIsRegistredInTournament(zero, player);
        assert(checkStatus == true);
        vm.expectRevert();
        tournamentManager.registerForTournament(player);
        (uint8 wins, uint8 losses) = tournamentManager.getPlayerScore(zero, player);
        assertEq(wins, losses);
        uint numbersOfPLayersReg = tournamentManager.getNumberOfPlayersRegistred(zero);
        assertEq(numbersOfPLayersReg, 1);
        (address[]  memory players, uint256[] memory win, uint256[] memory loss) = tournamentManager.getTournamentAllData(zero);
        assert(players[0] == player);
        assertEq(win, loss);
        uint256 w = tournamentManager.getPlayerAllWinsCumulated(player);
        uint256 l = tournamentManager.getPlayerAllLossesCumulated(player);
        assertEq(w, l);
        vm.stopPrank();
    }
}