require('@nomiclabs/hardhat-waffle')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

const RINKEBY_PRIVATE_KEY =
  '3ace7cb2f2efcde3d9cc5fbdb6bd267ca62e75e77a0236b8b50f1d08e45be3bb'

module.exports = {
  solidity: '0.8.4',
  networks: {
    rinkeby: {
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      accounts: [`0x${RINKEBY_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: process.env.REACT_APP_API_KEY,
  },
}
