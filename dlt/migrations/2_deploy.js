const BlogGen = artifacts.require('BlogGen')

module.exports = function (deployer) {
  deployer.deploy(BlogGen)
}
