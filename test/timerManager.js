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
  });

  it("start should generate different ids", async function() {
    let tx1 = await timerManager.start(5, false);
    tx1 = await tx1.wait();

    let tx2 = await timerManager.start(5, false);
    tx2 = await tx2.wait();

    let id1 = tx1.events[0].args.id;
    let id2 = tx2.events[0].args.id;
    expect(id1).not.equal(id2);
  });

  it("pause should emit a PauseTimerEvent", async function() {
    let result = await timerManager.start(5, false);
    let tx = await result.wait();
    let id = tx.events[0].args.id;

    await expect(timerManager.pause(id))
      .to.emit(timerManager, "PauseTimerEvent");
  });

  it("pause should not allow invalid id", async function() {
    await expect(timerManager.pause(5000)).to.be.reverted;
  });

  it("restart should emit a RestartTimerEvent", async function() {
    let result = await timerManager.start(5, false);
    let tx = await result.wait();
    let id = tx.events[0].args.id;

    await expect(timerManager.restart(id))
      .to.emit(timerManager, "RestartTimerEvent");
  });

  it("restart should not allow invalid id", async function() {
    await expect(timerManager.restart(5000)).to.be.reverted;
  });

  it("resume should emit a ResumeTimerEvent", async function() {
    let result = await timerManager.start(5, false);
    let tx = await result.wait();
    let id = tx.events[0].args.id;

    await expect(timerManager.resume(id))
      .to.emit(timerManager, "ResumeTimerEvent");
  });

  it("resume should not allow invalid id", async function() {
    await expect(timerManager.resume(5000)).to.be.reverted;
  });

  it("destroy should emit a DestroyTimerEvent", async function() {
    let result = await timerManager.start(5, false);
    let tx = await result.wait();
    let id = tx.events[0].args.id;

    await expect(timerManager.destroy(id))
      .to.emit(timerManager, "DestroyTimerEvent");
  });

  it("destroy should destroy id", async function() {
    let result = await timerManager.start(5, false);
    let tx = await result.wait();
    let id = tx.events[0].args.id;

    let destroy_tx = await timerManager.destroy(id);
    destroy_tx = await destroy_tx.wait();

    await expect(timerManager.destroy(id)).to.be.reverted;
  });

  it("onTimeout should emit ExpireTimerEvent", async function() {
    let result = await timerManager.start(5, false);
    let tx = await result.wait();
    let id = tx.events[0].args.id;

    await expect(timerManager.onTimeout(id, false, timerCallback.address))
      .to.emit(timerManager, "ExpireTimerEvent");
  });

  it("onTimeout should not allow invalid id", async function() {
    await expect(timerManager.onTimeout(5000)).to.be.reverted;
  });

  it("onTimeout should restart when marked as periodic", async function() {
    let result = await timerManager.start(5, true);
    let tx = await result.wait();
    let id = tx.events[0].args.id;

    await expect(timerManager.onTimeout(id, true, timerCallback.address))
      .to.emit(timerManager, "RestartTimerEvent");
  });

  it("onTimeout should destroy when not marked as periodic", async function() {
    let result = await timerManager.start(5, false);
    let tx = await result.wait();
    let id = tx.events[0].args.id;

    await expect(timerManager.onTimeout(id, false, timerCallback.address))
      .to.emit(timerManager, "DestroyTimerEvent");
  });
});
