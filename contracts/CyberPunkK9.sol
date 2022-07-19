// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CyberPunkK9 is ERC721Enumerable, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter _tokenIds;

    string public baseURI;
    string public baseExtension = ".json";
    string public notRevealedUri;

    uint256 public oGMintCost = 30000000000000000;
    uint256 public whitelistedMintCost = 45000000000000000;
    uint256 public publicMintCost = 60000000000000000;

    uint256 public maxSupply = 2088;
    uint256 public maxMintQuantity = 5;
    uint256 public nftPerAddressLimit = 5;

    bool public paused = false;
    bool public revealed = false;

    bool public oGCanMint = false;
    bool public whitelistedCanMint = false;
    bool public publicCanMint = false;
    bool public freeClaimCanMint = false;

    address[] public whitelistedAddresses;
    address[] public oGAddresses;
    address[] public freeClaimAddresses;

    mapping(address => uint256) public addressMintedBalance;

    constructor() ERC721("CyberPunks K9", "CPK9") {
        setBaseURI("https://domain/nft/api/");
        setNotRevealedURI("https://domain/nft/api/0.json");

        _tokenIds._value = 208;
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // public
    function mint(uint256 _mintQuantity) public payable {
        uint256 supply = _tokenIds.current();

        require(!paused, "the contract is paused");
        require(_mintQuantity > 0, "need to mint at least 1 NFT");
        require(
            _mintQuantity <= maxMintQuantity,
            "max mint amount per session exceeded"
        );
        require(supply + _mintQuantity <= maxSupply, "max NFT limit exceeded");

        if (msg.sender != owner()) {
            bool _isOG = isOG(msg.sender);
            bool _isWhitelisted = isWhitelisted(msg.sender);

            uint256 cost = 0;

            if (_isOG) {
                require(oGCanMint, "OG users can't mint yet.");
                cost = oGMintCost;
            }

            if (_isWhitelisted) {
                require(
                    whitelistedCanMint,
                    "Whitelisted users can't mint yet."
                );
                cost = whitelistedMintCost;
            }

            if (_isOG || _isWhitelisted) {
                uint256 ownerMintedCount = addressMintedBalance[msg.sender];
                require(
                    ownerMintedCount + _mintQuantity <= nftPerAddressLimit,
                    "max NFT per address exceeded"
                );
            }

            if (_isOG == false && _isWhitelisted == false) {
                require(publicCanMint, "Public users can't mint yet.");
                cost = publicMintCost;
            }

            require(msg.value >= cost * _mintQuantity, "insufficient funds");
        }

        for (uint256 i = 1; i <= _mintQuantity; i++) {
            addressMintedBalance[msg.sender]++;

            _tokenIds.increment();
            _safeMint(msg.sender, _tokenIds.current());
        }
    }

    function freeClaim(uint256 tokenId) public payable {
        require(!paused, "the contract is paused");
        require(freeClaimCanMint, "Free claiming is not active yet.");
        require(
            tokenId >= 1 && tokenId <= 208,
            "Token ID is not within the free claim IDs."
        );
        require(
            isFreeClaim(msg.sender, tokenId),
            "Token ID is not associated to your address."
        );

        _safeMint(msg.sender, tokenId);
    }

    function isOG(address _user) public view returns (bool) {
        for (uint256 i = 0; i < oGAddresses.length; i++) {
            if (oGAddresses[i] == _user) {
                return true;
            }
        }
        return false;
    }

    function isWhitelisted(address _user) public view returns (bool) {
        for (uint256 i = 0; i < whitelistedAddresses.length; i++) {
            if (whitelistedAddresses[i] == _user) {
                return true;
            }
        }
        return false;
    }

    function isFreeClaim(address _user, uint256 _tokenId)
        public
        view
        returns (bool)
    {
        if (freeClaimAddresses[_tokenId - 1] == _user) {
            return true;
        }
        return false;
    }

    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if (revealed == false) {
            return notRevealedUri;
        }

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    //only owner
    function reveal(bool _state) public onlyOwner {
        revealed = _state;
    }

    function setNftPerAddressLimit(uint256 _limit) public onlyOwner {
        nftPerAddressLimit = _limit;
    }

    function setOGMintCost(uint256 _newCost) public onlyOwner {
        oGMintCost = _newCost;
    }

    function setWhitelistedMintCost(uint256 _newCost) public onlyOwner {
        whitelistedMintCost = _newCost;
    }

    function setPublicMintCost(uint256 _newCost) public onlyOwner {
        publicMintCost = _newCost;
    }

    function setMaxMintQuantity(uint256 _newMaxMintQuantity) public onlyOwner {
        maxMintQuantity = _newMaxMintQuantity;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedUri = _notRevealedURI;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function setOGCanMint(bool _state) public onlyOwner {
        oGCanMint = _state;
    }

    function setWhitelistedCanMint(bool _state) public onlyOwner {
        whitelistedCanMint = _state;
    }

    function setPublicCanMint(bool _state) public onlyOwner {
        publicCanMint = _state;
    }

    function setFreeClaimCanMint(bool _state) public onlyOwner {
        freeClaimCanMint = _state;
    }

    function whitelistUsers(address[] calldata _users) public onlyOwner {
        delete whitelistedAddresses;
        whitelistedAddresses = _users;
    }

    function oGUsers(address[] calldata _users) public onlyOwner {
        delete oGAddresses;
        oGAddresses = _users;
    }

    function freeClaimUsers(address[] calldata _users) public onlyOwner {
        delete freeClaimAddresses;
        freeClaimAddresses = _users;
    }

    //reserved NFTs for rewards, prizes
    function reservedMint(uint256 _qty, address _recipient) public onlyOwner {
        uint256 supply = _tokenIds.current();

        require(_qty > 0, "Need to mint at least 1 NFT");
        require(supply + _qty <= maxSupply, "No more NFTs to mint!");

        for (uint256 i = 1; i <= _qty; i++) {
            if (_recipient != owner()) {
                addressMintedBalance[_recipient]++;
            }

            _tokenIds.increment();
            _safeMint(_recipient, _tokenIds.current());
        }
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;

        // testnet
        payable(0xBEF558C04C3Bdd672E33333e7Ff1fc415937B5c4).transfer(
            (balance * 5) / 100
        );
        payable(0xb132f2c06a4079d546d4914a61E5c1Be65787fD6).transfer(
            (balance * 5) / 100
        );
        payable(0xfAA888552A7491E5724dA4F90b46248eD2565D21).transfer(
            address(this).balance
        );

        //        payable(0xceE523717E912c17B21100bb041ae46689acEbaE).transfer(balance * 5 / 100);
        //        payable(0xBEF558C04C3Bdd672E33333e7Ff1fc415937B5c4).transfer(balance * 5 / 100);
        //        payable(0xF3309975C3Ab758E8b3937f5C524002EB09AB5eB).transfer(address(this).balance);
    }
}
