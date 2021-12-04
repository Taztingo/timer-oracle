
// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

import "./ITimer.sol";
import "./ITimerCallback.sol";

contract TimerManager is ITimer {

    event StartTimerEvent(uint id, uint sec, bool periodic, address owner);
    event PauseTimerEvent(uint id);
    event ResumeTimerEvent(uint id);
    event RestartTimerEvent(uint id);
    event TimerExpireEvent(uint id);
    event DestroyTimerEvent(uint id);

    uint private nonce = 0;
    uint private modulus = 1000;
    mapping(uint => bool) timers;

    modifier hasTimer(uint _id) {
        require(timers[_id], "The timer does not exist");
        _;
    }

    function start(uint _seconds, bool _periodic) external override returns (uint) {
        uint256 id = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % modulus;
        timers[id] = true;
        emit StartTimerEvent(id, _seconds, _periodic, msg.sender);
        nonce++;
        return id;
    }

    function pause(uint _id) external override hasTimer(_id) {
        emit PauseTimerEvent(_id);
    }

    function restart(uint _id) external override hasTimer(_id) {
        emit RestartTimerEvent(_id);
    }

    function resume(uint _id) external override hasTimer(_id) {
        emit ResumeTimerEvent(_id);
    }

    function destroy(uint _id) external override hasTimer(_id) {
        delete timers[_id];
        emit DestroyTimerEvent(_id);
    }

    function onTimeout(uint _id, bool _periodic, address _owner) external override hasTimer(_id) {
        emit TimerExpireEvent(_id);

        ITimerCallback callback = ITimerCallback(_owner);
        callback.onTimeout(_id);

        if(_periodic) {
            this.restart(_id);
        } else {
            this.destroy(_id);
        }
    }
}