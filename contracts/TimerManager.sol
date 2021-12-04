// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

import "./ITimer.sol";

contract TimerManager is ITimer {

    struct Timer {
        uint duration;
        uint startTime;
        bool isPaused;
        bool isPeriodic;
        address owner;
    }

    event StartTimerEvent(uint id, uint sec, bool periodic, address owner);
    event PauseTimerEvent(uint id);
    event ResumeTimerEvent(uint id);
    event RestartTimerEvent(uint id);

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

    function tick(uint _seconds) external {

    }
}