// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ITimerCallback.sol";
import "./ITimer.sol";

contract Heartbeat is ITimerCallback {
    constructor(address _address) {
        timer = ITimer(_address);
    }

    event HeartbeatEvent(string _memory);
    mapping(uint => string) messages;

    ITimer timer;

    modifier hasId(uint _id) {
        require(keccak256(abi.encodePacked(messages[_id])) == keccak256(abi.encodePacked("")) , "The id does not exist");
        _;
    }

    function add(string calldata _message, uint _seconds, bool _periodic) external {
        uint id = timer.start(_seconds, _periodic);
        messages[id] = _message;
    }

    function setTimerManagerAddress(address _address) external {
        timer = ITimer(_address);
    }

    function onTimeout(uint _id) external override hasId(_id) {
        emit HeartbeatEvent(messages[_id]);
        delete messages[_id];
    }
}