const BlogGen = artifacts.require('BlogGen')

module.exports = async function (deployer, account) {
  await deployer.deploy(BlogGen)
  const IGen = await BlogGen.deployed()

  const addr = '0x4a9a888a4a1aa198adc7cdb0cb03872a3a9df4df'
  await IGen.newPost('Test', 'Test Desc', 'Myself', 1, addr)
  console.log('post success')
  const val = await IGen.getCreatorPostLength(addr)
  console.log('post success length: ', val)
  const such = await IGen.getIds();
  console.log('Post IDs: ', such);
}
