const { expect, assert } = require("chai");
const { ethers, waffle } = require("hardhat");
const { provider, deployMockContract } = waffle

const ITimerCallback = require('../artifacts/contracts/ITimerCallback.sol/ITimerCallback.json');

describe("TimerManager", () => {
  let timerCallback;
  let TimerManager;
  let timerManager;
  let wallet;
  let otherWallets;

  async function setupMock() {
    [wallet, otherWallets] = provider.getWallets();
    timerCallback = await deployMockContract(wallet, ITimerCallback.abi);
    await timerCallback.mock.onTimeout.returns();
  }

  before(async () => {
    await setupMock();
    TimerManager = await ethers.getContractFactory("TimerManager");
    timerManager = await TimerManager.deploy();
    await timerManager.deployed();
  });

  it("start should emit a StartTimerEvent", async function() {
    await expect(timerManager.start(5, false))
      .to.emit(timerManager, "StartTimerEvent")
    //await expect(heartbeat.onTimeout(1)).to.be.reverted;
    //assert(false, "Not yet implemented!");
  });

  it("start should generate different ids", async function() {
    let id1 = await timerManager.start(5, false);
    let id2 = await timerManager.start(5, false);
    expect(id1).not.equal(id2);
  });

  it("pause should emit a PauseTimerEvent", async function() {
    assert(false, "Not yet implemented!");
  });

  it("pause should not allow invalid id", async function() {
    assert(false, "Not yet implemented!");
  });

  it("restart should emit a RestartTimerEvent", async function() {
    assert(false, "Not yet implemented!");
  });

  it("restart should not allow invalid id", async function() {
    assert(false, "Not yet implemented!");
  });

  it("resume should emit a ResumeTimerEvent", async function() {
    assert(false, "Not yet implemented!");
  });

  it("resume should not allow invalid id", async function() {
    assert(false, "Not yet implemented!");
  });

  it("destroy should emit a DestroyTimerEvent", async function() {
    assert(false, "Not yet implemented!");
  });

  it("destroy should destroy id", async function() {
    assert(false, "Not yet implemented!");
  });

  it("onTimeout should emit TimerExpireEvent", async function() {
    assert(false, "Not yet implemented!");
  });

  it("onTimeout should not allow invalid id", async function() {
    assert(false, "Not yet implemented!");
  });

  it("onTimeout should restart when marked as periodic", async function() {
    assert(false, "Not yet implemented!");
  });

  it("onTimeout should destroy when not marked as periodic", async function() {
    assert(false, "Not yet implemented!");
  });
});
