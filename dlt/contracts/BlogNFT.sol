// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract BlogNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint256 public fees;

    constructor(string memory _name, string memory _symbol, uint _fee) ERC721(_name, _symbol){
        fees = _fee;
    }

    function safeMint(address _to, string calldata _uri) public payable {
        require(msg.value >= fees, "not enough eth");
        payable(owner()).transfer(fees);

        uint tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _uri);

        uint contractBal = address(this).balance;

        if(contractBal > 0) {
            payable(msg.sender).transfer(address(this).balance);
        }
    }

    function _burn(uint tokenId) internal override(ERC721, ERC721URIStorage){
        super._burn(tokenId);
    }

    function tokenURI(uint tokenId) public view override(ERC721, ERC721URIStorage) returns(string memory){
        super.tokenURI(tokenId);
    }

}