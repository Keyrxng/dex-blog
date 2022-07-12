const hre = require('hardhat')

async function main() {
  const Blog = await hre.ethers.getContractFactory('BlogNFT')
  const blog = await Blog.deploy('DexBlog', 'DBLG', '10000000000000000000000')

  await blog.deployed()
  console.log('Blog deployed to: ', blog.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
