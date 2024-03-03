// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  
  Donation = await hre.ethers.getContractFactory('Donation', deployer);
  donation = await Donation.deploy();
  await donation.waitForDeployment();

  console.log(
    `Contract Donation deployed to ${donation.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// sepolia
// Deploying contracts with the account: 0x8fDC49b8fC53Fd6b5303C3040734aea0291d0960
// Contract Donation deployed to 0x921d36C0B5B83ABa7F7e74459BF5FdA4Cd7C6201