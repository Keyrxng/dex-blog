import React from 'react'
import { useMoralis } from 'react-moralis'
import BottomNav from './common/BottomNav'
import Blog from './common/Blog'
import Header from './common/Header'

const Home = () => {
  return (
    <>
      <Header title="The Keychaxn" />
      <Blog />
      <BottomNav />
    </>
  )
}

export default Home
