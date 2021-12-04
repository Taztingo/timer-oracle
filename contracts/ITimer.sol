// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ITimer {
    function start(uint _seconds, bool _periodic) external returns (uint);
    function pause(uint _id) external;
    function resume(uint _id) external;
    function restart(uint _id) external;
}