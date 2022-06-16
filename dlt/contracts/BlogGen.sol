// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/utils/Strings.sol";

contract BlogGen is ERC721 {

    struct Post {
        string uri;
        string title;
        string desc;
        string creator;
        uint price;
        address wallet;
        bool locked;
    }

    Post[] posts;

    mapping(address => uint) creatorBalances;
    mapping(address => Post) userBoughtPosts;
    mapping(uint => Post) postLikes;

    // BlogAuth - BAuth
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
    }

    // mints an ER721 token to the given address
    function mint(address to, uint256 tokenId) public {
        super._mint(to, tokenId);
    }

    // mints an ERC721 token to the msg.sender and adds a new post to the array of posts
    function newPost(Post calldata _post, uint _tokenId) public {
        posts.push(_post);
        mint(msg.sender, _tokenId);
    }

    function buyPost(uint _cost, uint _tokenId, address _paymentToken) public {
        string memory data = tokenURI(_tokenId);
        bool res = super._exists(_tokenId);
        if(!res) {return false;}
        else{
            address addr = ownerOf(_tokenId);
            IERC20(_paymentToken).approve(address(this), _cost);
            IERC20(_paymentToken).transferFrom(msg.sender, addr, _cost);
        }
    }

    function tipPoster(uint _tip, address _token, uint _tokenId) public {
        bool res = super._exists(_tokenId);
        if(!res) {return false;}
        else{
            address addr = ownerOf(_tokenId);
            IERC20(_paymentToken).approve(address(this), _tip);
            IERC20(_paymentToken).transferFrom(msg.sender, addr, _tip);
        }
    }

    function likePost() public {
        
    }



    
}