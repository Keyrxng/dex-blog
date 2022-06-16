import React, { useReducer } from 'react'

import BlogContext from './blog-context'

const defaultBlogState = {
  contract: null,
  appOwner: null,
  totalSupply: null,
  purchasedTokens: null,
  tokenIsLoading: null,
  mostLiked: null,
  posts: null,
  userPosts: null,
}

const BlogReducer = (state, action) => {
  if (action.type === 'CONTRACT') {
    return {
      ...state,
      contract: action.contract,
    }
  }
  if (action.type === 'GETPOSTS') {
    return {
      ...state,
      posts: action.posts,
    }
  }
  if (action.type === 'GETUSERPOSTS') {
    return {
      ...state,
      userPosts: action.userPosts,
    }
  }

  if (action.type === 'LOADTOTALSUPPLY') {
    return {
      ...state,
      totalSupply: action.totalSupply,
    }
  }

  if (action.type === 'GETOWNER') {
    return {
      ...state,
      appOwner: action.appOwner,
    }
  }

  if (action.type === 'GETMOSTLIKED') {
    return {
      ...state,
      mostLiked: action.mostLiked,
    }
  }

  if (action.type === 'GETUSERPO') {
    return {
      ...state,
      purchasedTokens: action.purchasedTokens.map((token) => {
        return {
          account: token[0],
          amount: token[1],
        }
      }),
    }
  }

  if (action.type === 'LOADING') {
    return {
      ...state,
      tokenIsLoading: action.loading,
    }
  }

  return defaultBlogState
}

const BlogProvider = (props) => {
  const [BlogState, dispatchTokenAction] = useReducer(
    BlogReducer,
    defaultBlogState,
  )

  const loadContractHandler = (web3, presaleToken, deployedNetwork) => {
    const contract = deployedNetwork
      ? new web3.eth.Contract(presaleToken.abi, deployedNetwork.address)
      : ''
    dispatchTokenAction({ type: 'CONTRACT', contract: contract })
    return contract
  }

  const loadTotalSupplyHandler = async (contract) => {
    try {
      const totalSupply = await contracts.methods.totalSupply().call()
      dispatchTokenAction({ type: 'LOADTOTALSUPPLY', totalSupply: totalSupply })
      return totalSupply
    } catch (error) {
      console.log('loadTotalSupplyHandler Error: ', error)
    }
  }

  const loadAppOwnerHandler = async (contract) => {
    try {
      const appOwner = await contracts.methods.owner().call()
      dispatchTokenAction({ type: 'GETOWNER', appOwner: appOwner })
      return appOwner
    } catch (error) {
      console.log('loadAppOwnerHandler Error: ', error)
    }
  }
  const loadPostHandler = async (contract) => {
    try {
      const posts = await contracts.methods.getPosts().call()
      dispatchTokenAction({ type: 'GETPOSTS', posts: posts })
      return posts
    } catch (error) {
      console.log('loadPostHandler Error: ', error)
    }
  }
  const loadMostLikedHandler = async (contract) => {
    try {
      const mostLiked = await contracts.methods.getMostLiked().call()
      dispatchTokenAction({ type: 'GETMOSTLIKED', mostLiked: mostLiked })
      return mostLiked
    } catch (error) {
      console.log('loadMostLikedHandler Error: ', error)
    }
  }
  const loadUserPostsHandler = async (contract) => {
    try {
      const posts = await contracts.methods.getUserPosts().call()
      dispatchTokenAction({ type: 'GETMOSTLIKED', mostLiked: mostLiked })
      return mostLiked
    } catch (error) {
      console.log('loadMostLikedHandler Error: ', error)
    }
  }
  const loadCreatorBalanceHandler = async (contract) => {
    try {
      const posts = await contracts.methods.getUserPosts().call()
      dispatchTokenAction({ type: 'GETMOSTLIKED', mostLiked: mostLiked })
      return mostLiked
    } catch (error) {
      console.log('loadMostLikedHandler Error: ', error)
    }
  }
  const loadUserPostsHandler = async (contract) => {
    try {
      const posts = await contracts.methods.getUserPosts().call()
      dispatchTokenAction({ type: 'GETMOSTLIKED', mostLiked: mostLiked })
      return mostLiked
    } catch (error) {
      console.log('loadMostLikedHandler Error: ', error)
    }
  }

  const loadPurchasedTokensHandler = async (contract, account) => {
    try {
      const purchasedTokens = await contract.methods
        .getUserPosts(account)
        .call()
      dispatchTokenAction({
        type: 'GETUSERPOSTS',
        userPosts: purchasedTokens,
      })
      return purchasedTokens
    } catch (error) {
      console.log('loadPurchasedTokensHandler Error: ', error)
    }
  }

  const setTokenIsLoadingHandler = (loading) => {
    dispatchTokenAction({ type: 'LOADING', loading: loading })
  }

  const blogContext = {
    contract: BlogState.contract,
    totalSupply: BlogState.totalSupply,
    tokenIsLoading: BlogState.tokenIsLoading,
    appOwner: BlogState.appOwner,
    purchasedTokens: BlogState.purchasedTokens,
    mostLiked: loadMostLikedHandler,
    loadContract: loadContractHandler,
    loadTotalSupply: loadTotalSupplyHandler,
    loadAppOwner: loadAppOwnerHandler,
    loadPurchasedTokens: loadPurchasedTokensHandler,
    setTokenIsLoading: setTokenIsLoadingHandler,
    loadPosts: loadPostHandler,
    loadCreatorBalances: loadCreatorBalanceHandler,
    loadCreatorPosts: loadCreatorPostsHandler,
    loadUserBoughtPosts: loadUserPostsHandler,
  }

  return (
    <BlogContext.Provider value={blogContext}>
      {props.children}
    </BlogContext.Provider>
  )
}

export default BlogProvider
