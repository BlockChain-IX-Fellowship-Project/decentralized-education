const hre = require("hardhat");

async function main() {
  const Contract = await hre.ethers.getContractFactory("Certificate");
  const contract = await Contract.deploy();

  // No need to await contract.deployed() in ethers v6
  console.log("Contract deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});