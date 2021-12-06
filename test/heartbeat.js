const { expect, assert } = require("chai");
const { ethers, waffle } = require("hardhat");
const { provider, deployMockContract } = waffle

const ITimer = require('../artifacts/contracts/ITimer.sol/ITimer.json');

describe("Heartbeat", () => {
  let timerManager;
  let Heartbeat;
  let heartbeat;

  async function setupMock() {
    const [wallet, otherWallets] = provider.getWallets();
    timerManager = await deployMockContract(wallet, ITimer.abi);
    await timerManager.mock.start.returns(0);
  }

  before(async () => {
    await setupMock();
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
