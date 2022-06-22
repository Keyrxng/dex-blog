// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/utils/Strings.sol";

contract BlogGen is ERC1155, Ownable {

    struct Post {
        string title;
        string desc;
        string creator;
        uint price;
        uint likes;
        address wallet;
    }

    Post[] public posts;

    mapping(address => mapping(address => uint)) internal creatorBalances;
    mapping(address => mapping(uint => Post)) internal creatorPosts; // creatorPosts[msg.sender][len]
    mapping(address => Post[]) creatorPossts;
    mapping(address => uint) internal creatorEthBalances;
    mapping(address => Post[]) internal userBoughtPosts;
    mapping(address => Post[]) internal userLikedPosts;

    error ValueError(uint entered, uint required);
    error PostPurchaseError();
    error BlogExistence(uint id);

    // BlogAuth - BAuth
    constructor() ERC1155("https://wfadi11lk1u3.usemoralis.com/{id}.json") {
        newPost('Display Placeholder', 'For UI purposes', 'Myself', 1337, msg.sender);
        newPost('Display Place', 'For UI purposes', 'Myself', 1337, msg.sender);
        newPost('Display ', 'For UI purposes', 'Myself', 1337, msg.sender);
        newPost('Placeholder', 'For UI purposes', 'Myself', 1337, msg.sender);
    }

    /// @notice mints an ERC1155 token to the given address
    function mint(address to, uint256 tokenId, uint _amount, bytes memory _data) public {
        _mint(to, tokenId, _amount, _data);
    }

    /// @notice mints an ERC1155 token to the msg.sender and adds a new post to the array of posts
    /// @param _title is the title of the given post
    /// @param _desc is a short description of the post
    /// @param _creator is the alias of the person who wrote the post
    /// @param _price is the price set to purchase this post
    /// @param _wallet is the wallet which created the post
    function newPost(string memory _title, string memory _desc, string memory _creator, uint _price, address _wallet) public returns(bool){
        Post memory post = Post({
            title: _title,
            desc: _desc,
            creator: _creator,
            price: _price,
            likes: 0,
            wallet: _wallet
        });
        posts.push(post);
        uint postId = posts.length;
        mint(_wallet, postId, 1, '');
        creatorPosts[_wallet][postId] = post;
        return true;
    }

    function updatePosts(uint _id) public returns(bool){
        Post memory post = posts[_id];
        creatorPosts[msg.sender][_id] = post;
        return true;
    }

    /// @notice allows a user to purchase the post at the price set by the creator
    /// @notice the userBoughtPosts array will be filled with each purchase
    /// @param _cost of the given post set by the post creator
    /// @param _postId of the given post
    /// @param _paymentToken address of given ERC token to pay with
    function buyPost(uint _cost, uint _postId, address _paymentToken) public returns(bool) {
        uint len = posts.length;
        bool res = _postId < len;
        if(!res) {revert BlogExistence({id: _postId});
        }else{
            Post memory post = getSinglePost(_postId);
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

    /// @notice allows a user to purchase the post at the price set by the creator
    /// @notice the userBoughtPosts array will be filled with each purchase
    /// @param _cost of the given post set by the post creator
    /// @param _postId of the given post
    function buyPostEth(uint _cost, uint _postId) public payable returns(bool) {
        require(msg.value >= _cost);
        uint len = posts.length;
        bool res = _postId < len;
        if(!res) {revert BlogExistence({id: _postId});
        }else{
            Post memory post = getSinglePost(_postId);
            if(msg.value < post.price) {
                revert ValueError({
                    entered: msg.value,
                    required: post.price
                });
            }else{
            creatorEthBalances[post.wallet] += msg.value;
            userBoughtPosts[msg.sender].push(post);
            return true;
            }
        }
    }

    /// @notice allows the creator to be tipped an arbritrary amount in any ERC token
    /// @param _tip how much given to the creator as a tip
    /// @param _paymentToken is the address of the chosen ERC token to tip
    /// @param _postId of the post on which the user tipped the author from
    function tipPoster(uint _tip, address _paymentToken, uint _postId) public returns(bool){
        uint len = posts.length;
        bool res = _postId < len;
                if(!res) {revert BlogExistence({id: _postId});
        }else{
            Post memory post = getSinglePost(_postId);
            creatorBalances[post.wallet][_paymentToken] += _tip;
            IERC20(_paymentToken).approve(address(this), _tip);
            IERC20(_paymentToken).transferFrom(msg.sender, post.wallet, _tip);
            return true;
        }
    }

    /// @notice allows the creator to be tipped an arbitrary amount in eth
    /// @param _tip how much given to the creator as a tip
    /// @param _postId of the post on which the user tipped the author from
    function tipPosterEth(uint _tip, uint _postId) public payable returns(bool){
        require(msg.value > 0);
        uint len = posts.length;
        bool res = _postId < len;
                if(!res) {revert BlogExistence({id: _postId});
        }else{
            Post memory post = getSinglePost(_postId);
            creatorEthBalances[post.wallet] += msg.value;
            return true;
        }
    }

    /// @notice increases the like count of a post and adds the post to the user's liked posts
    /// @param _postId of the post to like
    function likePost(uint _postId) public returns(bool){
        uint len = posts.length;
        bool res = _postId < len;
                if(!res) {revert BlogExistence({id: _postId});
        }else{
            Post storage post = posts[_postId];
            post.likes = post.likes + 1;
            userLikedPosts[msg.sender].push(post);
            return true;
        }
    }

    /// @notice returns all posts created by a given address
    /// @param _user that has previously created a post
    // function getCreatorPosts(address _user) public view returns(Post[] memory){
    //     uint len = getCreatorPostLength(_user);
    //     Post[] memory postz;
    //     for(uint x = 0; x < len; x ++) {
    //         Post memory _post = creatorPosts[_user][x];
    //         Post[] memory postss;
    //         postss.push(_post);
    //     }
    //     return postz ;
    // }

    /// @notice returns an array of the purchased posts for the param
    /// @param _user of wallet which has purchased a post(s)
    function getUserPosts(address _user) public view returns(Post[] memory){
        return userBoughtPosts[_user];
    }

    /// @notice returns the number of posts for the param
    /// @param _user of wallet which has created a post(s)
    function getCreatorPostLength(address _user) public view returns(uint){
        uint len;
        for(uint x=0;x<posts.length;x++){
            Post storage post = creatorPosts[_user][x];
            address rl = post.wallet;
            if(rl == _user){
                len++;
            }
        }
        return len;
    }

    /// @notice returns a single specific post publicly
    /// @param _id of post
    function getSinglePost(uint _id) public view returns(Post memory){
        Post memory post = posts[_id];
        return post;
    }
    
    /// @notice returns all created posts
    function getPosts() public view returns(Post[] memory){
        return posts;
    }

    /// @notice returns a single specific post publically
    /// @param _index of the array of posts
    function getPostById(uint _index) public view returns(Post memory){
        return posts[_index];
    }

    /// @notice returns the total number of posts that have been created
    function getPostsLength() public view returns(uint){
        return posts.length;
    }

    /// @notice returns the most liked post by sorting through all created posts
    function getMostLiked() public view returns(Post memory){
        uint mostLiked;
        Post memory mostLikedPost;
        for(uint x = 0; x < posts.length; x++){
            Post storage post = posts[x];
            uint likes = post.likes;
            if(likes > mostLiked){
                mostLiked = likes;
                mostLikedPost = post;
            }
        }
        return mostLikedPost;
    }

    /// @notice allows the creator to withdraw their token payments
    /// @param _token array of provided payment token addresses
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

    /// @notice allows a post creator to withdraw their balance
    function creatorEthWithdraw() public returns(bool){
        uint bal = creatorEthBalances[msg.sender];
        require(bal > 0);
        address payable creator = payable(msg.sender);
        creatorEthBalances[creator] = 0;
        creator.transfer(bal);
        return true;
    }

    fallback() external payable {}
    receive() external payable {}   
}