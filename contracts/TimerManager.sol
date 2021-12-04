// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

import "./ITimer.sol";

contract TimerManager is ITimer {

    struct Timer {
        uint duration;
        uint endTime;
        bool isPaused;
        bool isPeriodic;
        address owner;
    }

    event StartTimerEvent(uint id, uint sec, bool periodic, address owner);
    event PauseTimerEvent(uint id);
    event ResumeTimerEvent(uint id);
    event RestartTimerEvent(uint id);
    event TimerExpireEvent(uint id);

    uint private nonce = 0;
    uint private modulus = 1000;
    mapping(uint => Timer) timerMap;
    uint[] timerIds;

    function start(uint _seconds, bool _periodic) external returns (uint) {
        uint256 id = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % modulus;
        Timer memory timer = Timer(_seconds, block.timestamp, false, _periodic, msg.sender);
        timerMap[id] = timer;
        timerIds.push(id);

        emit StartTimerEvent(id, _seconds, _periodic, msg.sender);
        nonce++;
        return id;
    }

    function pause(uint _id) external {

    }

    function restart(uint _id) external {

    }

    function resume(uint _id) external {

    }


    function tick() external {
        // Find the expired timers
        for(uint i = 0; i < timerIds.length; i++) {
            uint id = timerIds[i];
            Timer memory timer = timerMap[id];

            // Timer expired
            if(!timer.isPaused && block.timestamp > timer.endTime) {
                emit TimerExpireEvent(id);
                if(timer.isPeriodic) {
                    this.restart(id);
                } else {
                    // Replace element with last one and remove from map
                    timerIds[i] = timerIds[timerIds.length - 1];
                    timerIds.pop();
                    delete timerMap[id];

                    // Decrement i so we stay on same index
                    i--;
                }
            }
        }
    }
}