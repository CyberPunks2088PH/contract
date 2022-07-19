const hre = require("hardhat");
const { ethers, waffle} = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const CyberPunkK9 = await hre.ethers.getContractFactory("CyberPunkK9");
    const cyberPunkK9 = await CyberPunkK9.deploy();

    console.log("\nCyberPunkK9 contract (mainnet) deployed to:", cyberPunkK9.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });