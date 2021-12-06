const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Heartbeat", () => {
  let TimerManager;
  let timerManager;
  let Heartbeat;
  let heartbeat;

  before(async () => {
    TimerManager = await ethers.getContractFactory("MockTimerManager");
    timerManager = await TimerManager.deploy();
    await timerManager.deployed();

    Heartbeat = await ethers.getContractFactory("Heartbeat");
    heartbeat = await Heartbeat.deploy(timerManager.address);
    await heartbeat.deployed();
  });

  it("add should create a new heartbeat", async function() {
    await expect(heartbeat.add("Hello World", 5, false))
      .to.emit(heartbeat, "HeartbeatAddEvent")
      .withArgs(0, "Hello World");
  });

  it("setTimerManager should update the address for the timer manager", async function() {
    await expect(heartbeat.setTimerManagerAddress(heartbeat.address))
      .to.emit(heartbeat, "TimerManagerUpdateEvent")
      .withArgs(heartbeat.address);
  });

  it("onTimeout should emit HeartbeatEvent on success", async function() {
    await expect(heartbeat.onTimeout(0))
      .to.emit(heartbeat, "HeartbeatEvent")
      .withArgs("Hello World");
  });

  it("onTimeout should rollback if timer id does not exist", async function() {
    await expect(heartbeat.onTimeout(1)).to.be.reverted;
  });
});
