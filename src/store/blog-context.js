import React from 'react'

const BlogContext = React.createContext({
  contract: null,
  totalSupply: null,
  appOwner: null,
  purchasedtokens: null,
  tokenIsLoading: null,
  posts: null,
  creatorBalances: null,
  creatorPosts: null,
  userBoughtPosts: null,
  mostLiked: null,
  loadContract: () => {},
  loadTotalSupply: () => {},
  loadAppOwner: () => {},
  loadPurchasedTokens: () => {},
  setTokenIsLoading: () => {},
  loadPosts: () => {},
  loadCreatorBalances: () => {},
  loadCreatorPosts: () => {},
  loadUserBoughtPosts: () => {},
  loadMostLiked: () => {},
})

export default BlogContext
