import { useState, useEffect } from 'react'
import './HomeAuth.css'
import axios from 'axios'
import BlogCard from '../components/BlogCard'
import {
  getChain,
  useMoralisWeb3Api,
  useChain,
  getSupportedChains,
  chainId,
} from 'react-moralis'
import { providers } from 'ethers'

const HomeAuth = () => {
  const [blogs, setBlogs] = useState()
  const [blogsContent, setBlogsContent] = useState()
  const web3API = useMoralisWeb3Api()

  const fetchAllNfts = async () => {
    let chain = getChain()
    console.log(chain)
    const options = {
      chain: chain,
      address: '0x03CbFEf147843a1A98882964f234C1BEEc8B4693',
    }

    const fujiNFTS = await web3API.token.getNFTOwners(options)
    const tokenUri = fujiNFTS?.result?.map((data) => {
      const { metadata, owner_of } = data

      if (metadata) {
        const metadataObj = JSON.parse(metadata)
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
    if (!blogs) {
      fetchAllNfts()
    }
  }, [blogs])

  return (
    <div className="homeAuth_container">
      <div className="homeAuth_header">Recommended Blogs</div>
      <div className="homeAuth_blogs">
        {blogsContent &&
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
          })}
      </div>
    </div>
  )
}

export default HomeAuth
