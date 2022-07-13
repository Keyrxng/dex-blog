import { useEffect, useState } from 'react'
import './MyBlogs.css'
import { Button } from 'web3uikit'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import BlogCard from '../components/BlogCard'
import { useMoralisWeb3Api, useMoralis, getChain } from 'react-moralis'

const MyBlogs = () => {
  const Web3API = useMoralisWeb3Api()
  const { isAuthenticated, account, isInitialized } = useMoralis()
  const [blogs, setBlogs] = useState([])
  const [blogsContent, setBlogsContent] = useState()

  const navigate = useNavigate()

  const fetchAllNfts = async () => {
    const options = {
      chain: '0x61',
      address: account,
      token_address: '0x934772EE88CB749E827f720564061B80D2054D36',
    }

    const fujiNFTS = await Web3API.account.getNFTsForContract(options)
    console.log('fujiNFTS', fujiNFTS)

    const tokenUri = fujiNFTS?.result?.map((data) => {
      const { metadata, owner_of } = data
      console.log('data', data)

      if (metadata) {
        const metadataObj = JSON.parse(metadata)
        console.log('metadataObj', metadataObj)

        const { externalUrl } = metadataObj
        return { externalUrl, owner_of }
      } else {
        return undefined
      }
    })
    setBlogs(tokenUri)
  }

  const fetchBlogsContent = async () => {
    const limit = blogs?.slice(0, 5)
    let contentBlog = []
    if (limit) {
      limit.map(async (blog) => {
        if (blog) {
          const { externalUrl, owner_of } = blog
          const res = await axios.get(externalUrl)
          const text = res.data.text.toString()
          const title = res.data.title
          contentBlog.push({ title, text, owner_of, externalUrl })
        }
      })
    }

    setBlogsContent(contentBlog)
  }

  useEffect(() => {
    if (blogs && !blogsContent) {
      fetchBlogsContent()
    }
  }, [blogs, blogsContent])
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchAllNfts()
    }
  }, [isInitialized, isAuthenticated, account])

  const clickHandler = async () => {
    navigate('/newStory')
  }

  return (
    <>
      <div className="myBlogsHeader">Your Blogs</div>
      {blogsContent && blogsContent?.length > 0 ? (
        blogsContent.map((blog, i) => {
          const { title, text, owner_of, externalUrl } = blog
          return (
            <BlogCard
              key={i}
              title={title}
              text={text}
              ownerOf={owner_of}
              externalUrl={externalUrl}
            />
          )
        })
      ) : (
        <div style={{ fontSize: '30px', width: '100%', marginLeft: '40%' }}>
          <p>No Blogs Yet</p>
          <Button text="Create one" onClick={clickHandler} />
        </div>
      )}
    </>
  )
}

export default MyBlogs
