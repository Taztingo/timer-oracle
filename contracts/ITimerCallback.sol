// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ITimerCallback {
    function onTimeout(uint _id) external;
}