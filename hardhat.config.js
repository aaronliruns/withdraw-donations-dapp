require("@nomicfoundation/hardhat-toolbox");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/FaKfKKKwyqw84L37hhIQCtrdVxoFYluj",
      },
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/LQ7THXd1ocSFmbai169OryzQMqtMuSZ2",
      accounts: ['0xf7074f2470bc7d629ff55f514b41e9c71f5f26987e08ddd634b1c40091fd7d95'],
    }
  },
};
