require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks:{
     sepolia: {
      url: `${process.env.NETWORK_URL}`,
      accounts: [process.env.WALLET_PRIVATE_KEY],
      chainId: 84532,
    },
  }
};
