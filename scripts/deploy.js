async function main() {
  // We get the contract to deploy
  const TimerManager = await ethers.getContractFactory("TimerManager");
  const timerManager = await TimerManager.deploy();

  const Heartbeat = await ethers.getContractFactory("Heartbeat");
  const heartbeat = await Heartbeat.deploy(timerManager.address);

  console.log("TimerManager and Heartbeat have both been deployed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });