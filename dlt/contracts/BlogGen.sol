// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/utils/Strings.sol";

contract BlogGen is ERC721, Ownable {

    struct Post {
        string uri;
        string title;
        string desc;
        string creator;
        uint id;
        uint price;
        uint likes;
        address wallet;
    }

    Post[] posts;

    mapping(address => mapping(address => uint)) creatorBalances;
    mapping(address => Post[]) creatorPosts;
    mapping(address => Post[]) userBoughtPosts;

    error ValueError(uint entered, uint required);
    error PostPurchaseError();
    error BlogExistence(uint id);

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
        creatorPosts[msg.sender].push(_post);
        mint(msg.sender, _tokenId);
    }

    function buyPost(uint _cost, uint _tokenId, address _paymentToken) public returns(bool) {
        bool res = super._exists(_tokenId);
        if(!res) {revert BlogExistence({id: _tokenId});
        }else{
            Post memory post = getUserSinglePost(_tokenId);
            if(_cost < post.price) {
                revert ValueError({
                    entered: _cost,
                    required: post.price
                });
            }else{
            creatorBalances[post.wallet][_paymentToken] += _cost;
            IERC20(_paymentToken).approve(address(this), _cost);
            IERC20(_paymentToken).transferFrom(msg.sender, post.wallet, _cost);
            userBoughtPosts[msg.sender].push(post);
            return true;
            }
        }
    }

    function tipPoster(uint _tip, address _paymentToken, uint _tokenId) public returns(bool){
        bool res = super._exists(_tokenId);
        if(!res) {revert BlogExistence({id: _tokenId});
        }else{
            Post memory post = getUserSinglePost(_tokenId);
            creatorBalances[post.wallet][_paymentToken] += _tip;
            IERC20(_paymentToken).approve(address(this), _tip);
            IERC20(_paymentToken).transferFrom(msg.sender, post.wallet, _tip);
            return true;
        }
    }

    function likePost(uint _tokenId) public view returns(bool){
        bool res = super._exists(_tokenId);
        if(!res) {revert BlogExistence({id: _tokenId});
        }else{
            Post memory post = getUserSinglePost(_tokenId);
            post.likes += 1;
            return true;
        }
    }

    function getCreatorPosts(address _user) internal view returns(Post[] memory){
        Post[] memory _posts = creatorPosts[_user];
        return _posts ;
    }

    function getUserPosts(address _user) public view returns(Post[] memory){
        return userBoughtPosts[_user];
    }

    function getUserSinglePost(uint _id) internal view returns(Post memory){
        Post memory post = posts[_id];
        return post;
    }
    function getPosts() public view returns(Post[] memory){
        return posts;
    }
    function getMostLiked() public view returns(Post memory){
        uint[] memory likedList;
        uint mostLiked;
        Post memory mostLikedPost;
        for(uint x = 0; x < posts.length; x++){
            Post memory post = posts[x];
            uint likes = post.likes;
            likedList[likes];
            if(likes > mostLiked){
                mostLiked = likes;
                mostLikedPost = post;
            }
        }
        return mostLikedPost;
    }

    function getIds() internal view returns(uint){
        return posts.length -1;
    }

    function creatorWithdraw(address[] calldata _token) public returns(bool){
        if(_token.length < 1) {
        uint bal = creatorBalances[msg.sender][_token[0]];
        IERC20(_token[0]).transfer(msg.sender, bal);
        }else{
            for(uint x=0;x<_token.length;x++){
                uint bal = creatorBalances[msg.sender][_token[x]];
                IERC20(_token[x]).transfer(msg.sender, bal);
            }
        }
        return true;
    }

    fallback() external payable {}
    receive() external payable {}

    function ethWithdraw() public returns(bool){
        uint bal = address(this).balance;
        address payable _owner = payable(owner());
        _owner.transfer(bal);
        return true;
    }




    
}