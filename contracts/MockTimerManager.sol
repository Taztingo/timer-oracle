
// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

import "./ITimer.sol";

contract MockTimerManager is ITimer {

    uint private nonce = 0;

    function start(uint _seconds, bool _periodic) external override returns (uint) {
        return nonce++;
    }

    function pause(uint _id) external override {
    }

    function restart(uint _id) external override {
    }

    function resume(uint _id) external override {
    }

    function destroy(uint _id) external override {
    }

    function onTimeout(uint _id, bool _periodic, address _owner) external override {
    }
}