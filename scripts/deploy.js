const hre = require("hardhat");
const { ethers, waffle} = require("hardhat");

async function main() {
    let production = false;
    let testRun = false;

    const [deployer, freeMint1, freeMint2, OG1, OG2, whitelisted1, whitelisted2, public1, public2, developer, team, operations] = await ethers.getSigners();
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
        console.log("Developer: " + developer.address + "\n");
        console.log("Team: " + team.address + "\n");
        console.log("Operations: " + operations.address + "\n");

        await sneakerverse.mint(1);

        await sneakerverse.freeMintUsers([freeMint1.address, freeMint2.address]);
        console.log("sneakerverse.freeMintUsers([freeMint1.address, freeMint2.address]\n");

        await sneakerverse.whitelistUsers([whitelisted1.address, whitelisted2.address]);
        console.log("sneakerverse.whitelistUsers([whitelisted1.address, whitelisted2.address]\n");

        await sneakerverse.oGUsers([OG1.address, OG2.address]);
        console.log("sneakerverse.oGUsers([OG1.address, OG2.address]\n");

        await sneakerverse.connect(freeMint1).mint(1);
        console.log("sneakerverse.connect(freeMint1).mint(1)\n");

        await sneakerverse.connect(freeMint2).mint(1);
        console.log("sneakerverse.connect(freeMint2).mint(1)\n");

        await sneakerverse.setOGCanMint(true);
        console.log("sneakerverse.setOGCanMint(true)\n");

        let oGMintCost = await sneakerverse.oGMintCost();
        console.log("sneakerverse.oGMintCost: " + oGMintCost + "\n");

        await sneakerverse.connect(OG1).mint(1, { value: oGMintCost });
        console.log("sneakerverse.connect(OG1).mint(1)\n");

        await sneakerverse.connect(OG2).mint(1, { value: oGMintCost });
        console.log("sneakerverse.connect(OG2).mint(1)\n");

        await sneakerverse.setWhitelistedCanMint(true);
        console.log("sneakerverse.setWhitelistedCanMint(true)\n");

        let whitelistedMintCost = await sneakerverse.whitelistedMintCost();
        console.log("sneakerverse.whitelistedMintCost: " + whitelistedMintCost + "\n");

        await sneakerverse.connect(whitelisted1).mint(1, { value: whitelistedMintCost });
        console.log("sneakerverse.connect(whitelisted1).mint(1)\n");

        await sneakerverse.connect(whitelisted2).mint(1, { value: whitelistedMintCost });
        console.log("sneakerverse.connect(whitelisted1).mint(1)\n");

        await sneakerverse.setPublicCanMint(true);
        console.log("sneakerverse.setPublicCanMint(true)\n");

        let publicMintCost = await sneakerverse.publicMintCost();
        console.log("sneakerverse.publicMintCost: " + publicMintCost + "\n");

        await sneakerverse.connect(public1).mint(1, { value: publicMintCost });
        console.log("sneakerverse.connect(public1).mint(1)\n");

        await sneakerverse.connect(public2).mint(1, { value: publicMintCost });
        console.log("sneakerverse.connect(public2).mint(1)\n");

        let tokenURI = await sneakerverse.tokenURI(1);
        console.log("sneakerverse.tokenURI(1): " + tokenURI + "\n");

        await sneakerverse.reveal(true);
        console.log("sneakerverse.reveal(true)\n");

        tokenURI = await sneakerverse.tokenURI(1);
        console.log("sneakerverse.tokenURI(1): " + tokenURI + "\n");

        let provider = waffle.provider;
        let balance = await provider.getBalance(sneakerverse.address);
        console.log("await provider.getBalance(sneakerverse.address): " + balance + "\n");

        await sneakerverse.withdraw();
        console.log("sneakerverse.withdraw()\n");

        balance = await provider.getBalance(developer.address);
        console.log("await provider.getBalance(developer.address): " + balance + "\n");

        balance = await provider.getBalance(team.address);
        console.log("await provider.getBalance(team.address): " + balance + "\n");

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
