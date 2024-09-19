// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {TournamentManager} from "../src/TournamentManager.sol";

contract DeploySmartContract is Script {
    TournamentManager public tournamentManager;

    function run() external returns(TournamentManager) {
        vm.startBroadcast();
        tournamentManager = new TournamentManager();
        vm.stopBroadcast();
        return tournamentManager;
    }
}
