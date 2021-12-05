const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Heartbeat", () => {
  /*before(async () => {
    const TimerManager = await ethers.getContractFactory("MockTimerManager");
    const timerManager = await TimerManager.deploy();
    await timerManager.deployed();

    const Heartbeat = await ethers.getContractFactory("Heartbeat");
    const heartbeat = await Heartbeat.deploy(timerManager.address);
    await heartbeat.deployed();
  });*/

  it("Constructor should initially set the address for the timer manager", async function () {
    /*const TimerManager = await ethers.getContractFactory("MockTimerManager");
    const timerManager = await TimerManager.deploy();
    await timerManager.deployed();

    const Heartbeat = await ethers.getContractFactory("Heartbeat");
    const heartbeat = await Heartbeat.deploy(timerManager.address);
    await heartbeat.deployed();*/
    assert(false, "Not yet implemented!");
  });

  it("add should create a new heartbeat", async function() {
    const TimerManager = await ethers.getContractFactory("MockTimerManager");
    const timerManager = await TimerManager.deploy();
    await timerManager.deployed();

    const Heartbeat = await ethers.getContractFactory("Heartbeat");
    const heartbeat = await Heartbeat.deploy(timerManager.address);
    await heartbeat.deployed();

    await expect(heartbeat.add("Hello World", 5, false))
      .to.emit(heartbeat, "HeartbeatAddEvent")
      .withArgs(0, "Hello World");
  });

  it("setTimerManager should update the address for the timer manager", async function() {
    const TimerManager = await ethers.getContractFactory("MockTimerManager");
    const timerManager = await TimerManager.deploy();
    await timerManager.deployed();

    const Heartbeat = await ethers.getContractFactory("Heartbeat");
    const heartbeat = await Heartbeat.deploy(timerManager.address);
    await heartbeat.deployed();

    await expect(heartbeat.setTimerManagerAddress(heartbeat.address))
      .to.emit(heartbeat, "TimerManagerUpdateEvent")
      .withArgs(heartbeat.address);
  });

  it("onTimeout should emit HeartbeatEvent on success", async function() {
    const TimerManager = await ethers.getContractFactory("MockTimerManager");
    const timerManager = await TimerManager.deploy();
    await timerManager.deployed();

    const Heartbeat = await ethers.getContractFactory("Heartbeat");
    const heartbeat = await Heartbeat.deploy(timerManager.address);
    await heartbeat.deployed();

    await heartbeat.add("Hello World", 5, false);
    await expect(heartbeat.onTimeout(0))
      .to.emit(heartbeat, "HeartbeatEvent")
      .withArgs("Hello World");
  });

  it("onTimeout should rollback if timer id does not exist", async function() {
    const TimerManager = await ethers.getContractFactory("MockTimerManager");
    const timerManager = await TimerManager.deploy();
    await timerManager.deployed();

    const Heartbeat = await ethers.getContractFactory("Heartbeat");
    const heartbeat = await Heartbeat.deploy(timerManager.address);
    await heartbeat.deployed();

    await heartbeat.add("Hello World", 5, false);
    await expect(heartbeat.onTimeout(1)).to.be.reverted;
  });
});
