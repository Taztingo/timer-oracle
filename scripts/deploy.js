async function main() {
  // We get the contract to deploy
  const TimerManager = await ethers.getContractFactory("TimerManager");
  const timerManager = await TimerManager.deploy();

  const Heartbeat = await ethers.getContractFactory("Heartbeat");
  const heartbeat = await Heartbeat.deploy(timerManager.address);

  console.log("Heartbeat deployed to " + heartbeat.address);
  console.log("TimerManager deployed to " + timerManager.address);
  console.log("StartTimerEvent id: " + ethers.utils.id("StartTimerEvent(uint256,uint256,bool,address)"));
  console.log("PauseTimerEvent id: " + ethers.utils.id("PauseTimerEvent(uint256)"));
  console.log("ResumeTimerEvent id: " + ethers.utils.id("ResumeTimerEvent(uint256)"));
  console.log("RestartTimerEvent id: " + ethers.utils.id("RestartTimerEvent(uint256)"));
  console.log("ExpireTimerEvent id: " + ethers.utils.id("ExpireTimerEvent(uint256)"));
  console.log("DestroyTimerEvent id: " + ethers.utils.id("DestroyTimerEvent(uint256)"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });