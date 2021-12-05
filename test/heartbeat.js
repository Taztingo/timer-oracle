const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Heartbeat", () => {
  before(async () => {
    const TimerManager = await ethers.getContractFactory("TimerManager");
    const timerManager = await TimerManager.deploy();
    await timerManager.deployed();

    const Heartbeat = await ethers.getContractFactory("Heartbeat");
    const heartbeat = await Heartbeat.deploy(timerManager.address);
    await heartbeat.deployed();
  });

  it("Should initially set the address for the timer manager", async function () {
    assert(false, "Not yet implemented!");
  });

  it("Should update messages with add", async function() {
    //const tx = await heartbeat.add();
    //await tx.wait();
    assert(false, "Not yet implemented!");
  });

  it("Should update the address for the timer manager", async function() {
    assert(false, "Not yet implemented!");
  });

  it("Should emit HeartbeatEvent on timeout", async function() {
    assert(false, "Not yet implemented!");
  });

  it("Should rollback if timer id does not exist", async function() {
    assert(false, "Not yet implemented!");
  });

  it("Should delete id from messages on timeout", async function() {
    assert(false, "Not yet implemented!");
  });
});
