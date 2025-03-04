const { ethers, network } = require("hardhat");
const { writeFileSync } = require("fs");
const { join } = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy the MainContract using ethers v6 syntax
  const MainContract = await ethers.getContractFactory("MainContract");
  const mainContract = await MainContract.deploy();
  await mainContract.waitForDeployment();
  const mainAddress = mainContract.target;
  console.log("MainContract deployed to:", mainAddress);

  // Parameters for SubContract deployment
  const uid = "exampleUID";
  const password = "examplePassword";
  const companyName = "Example Company";

  // Deploy the SubContract via the MainContract function
  const tx = await mainContract.deploySubContract(uid, password, companyName);
  const receipt = await tx.wait();

  // Parse logs using the contract interface (ethers v6 style)
  let subAddress;
  for (const log of receipt.logs) {
    try {
      const parsedLog = mainContract.interface.parseLog(log);
      if (parsedLog.name === "SubContractDeployed") {
        subAddress = parsedLog.args.subContractAddress;
        break;
      }
    } catch (error) {
      // This log wasn't from MainContract, skip it
      continue;
    }
  }

  if (!subAddress) {
    throw new Error("SubContract address not found in event logs");
  }
  
  console.log("SubContract deployed to:", subAddress);

  // Save the contract addresses and network name to a configuration file
  const config = {
    mainContractAddress: mainAddress,
    subContractAddress: subAddress,
    network: network.name,
  };

  writeFileSync(
    join(__dirname, "../contract-config.json"),
    JSON.stringify(config, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
