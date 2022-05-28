const hre = require("hardhat");
const { ethers, waffle} = require("hardhat");

async function main() {
    let production = false;
    let testRun = true;

    const [deployer, freeClaim1, freeClaim2, OG1, OG2, whitelisted1, whitelisted2, public1, public2, developer1, developer2, operations] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);

    // Start: Deployments
    const CyberPunkK9 = await hre.ethers.getContractFactory("CyberPunkK9");
    const cyberPunkK9 = await CyberPunkK9.deploy();
    console.log("\nCyberPunkK9 deployed to:", cyberPunkK9.address);
    // End: Deployments

    // Start: Contract Initializations

    // End: Contract Initializations

    // Start: Sample Transactions
    if(testRun) {
        console.log("Developer 1: " + developer1.address + "\n");
        console.log("Developer 2: " + developer2.address + "\n");
        console.log("Operations: " + operations.address + "\n");

        await cyberPunkK9.mint(1);

        await cyberPunkK9.freeClaimUsers([freeClaim1.address, freeClaim2.address]);
        console.log("cyberPunkK9.freeClaimUsers([freeMint1.address, freeMint2.address]\n");

        await cyberPunkK9.whitelistUsers([whitelisted1.address, whitelisted2.address]);
        console.log("cyberPunkK9.whitelistUsers([whitelisted1.address, whitelisted2.address]\n");

        await cyberPunkK9.oGUsers([OG1.address, OG2.address]);
        console.log("cyberPunkK9.oGUsers([OG1.address, OG2.address]\n");

        await cyberPunkK9.setOGCanMint(true);
        console.log("cyberPunkK9.setOGCanMint(true)\n");

        let oGMintCost = await cyberPunkK9.oGMintCost();
        console.log("cyberPunkK9.oGMintCost: " + oGMintCost + "\n");

        await cyberPunkK9.connect(OG1).mint(1, { value: oGMintCost });
        console.log("cyberPunkK9.connect(OG1).mint(1)\n");

        await cyberPunkK9.connect(OG2).mint(1, { value: oGMintCost });
        console.log("cyberPunkK9.connect(OG2).mint(1)\n");

        await cyberPunkK9.setWhitelistedCanMint(true);
        console.log("cyberPunkK9.setWhitelistedCanMint(true)\n");

        let whitelistedMintCost = await cyberPunkK9.whitelistedMintCost();
        console.log("cyberPunkK9.whitelistedMintCost: " + whitelistedMintCost + "\n");

        await cyberPunkK9.connect(whitelisted1).mint(1, { value: whitelistedMintCost });
        console.log("cyberPunkK9.connect(whitelisted1).mint(1)\n");

        await cyberPunkK9.connect(whitelisted2).mint(1, { value: whitelistedMintCost });
        console.log("cyberPunkK9.connect(whitelisted1).mint(1)\n");

        await cyberPunkK9.setPublicCanMint(true);
        console.log("cyberPunkK9.setPublicCanMint(true)\n");

        let publicMintCost = await cyberPunkK9.publicMintCost();
        console.log("cyberPunkK9.publicMintCost: " + publicMintCost + "\n");

        await cyberPunkK9.connect(public1).mint(1, { value: publicMintCost });
        console.log("cyberPunkK9.connect(public1).mint(1)\n");

        await cyberPunkK9.connect(public2).mint(1, { value: publicMintCost });
        console.log("cyberPunkK9.connect(public2).mint(1)\n");

        await cyberPunkK9.setFreeClaimCanMint(true);
        console.log("cyberPunkK9.setFreeClaimCanMint(true)\n");

        await cyberPunkK9.connect(freeClaim1).freeClaim(1);
        console.log("cyberPunkK9.connect(freeMint1).freeClaim(1)\n");

        await cyberPunkK9.connect(freeClaim2).freeClaim(2);
        console.log("cyberPunkK9.connect(freeMint2).freeClaim(2)\n");

        let tokenURI = await cyberPunkK9.tokenURI(1);
        console.log("cyberPunkK9.tokenURI(1): " + tokenURI + "\n");

        await cyberPunkK9.reveal(true);
        console.log("cyberPunkK9.reveal(true)\n");

        tokenURI = await cyberPunkK9.tokenURI(1);
        console.log("cyberPunkK9.tokenURI(1): " + tokenURI + "\n");

        let provider = waffle.provider;
        let balance = await provider.getBalance(cyberPunkK9.address);
        console.log("await provider.getBalance(cyberPunkK9.address): " + balance + "\n");

        await cyberPunkK9.withdraw();
        console.log("cyberPunkK9.withdraw()\n");

        balance = await provider.getBalance(developer1.address);
        console.log("await provider.getBalance(developer1.address): " + balance + "\n");

        balance = await provider.getBalance(developer2.address);
        console.log("await provider.getBalance(developer2.address): " + balance + "\n");

        balance = await provider.getBalance(operations.address);
        console.log("await provider.getBalance(operations.address): " + balance + "\n");
    }
    // End: Sample Transactions
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
