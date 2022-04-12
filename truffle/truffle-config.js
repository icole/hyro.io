const HDWallet = require("truffle-hdwallet-provider");
const INFURA_KEY = process.env.INFURA_KEY;
const HYRO_MNEMONIC = process.env.HYRO_MNEMONIC;

module.exports = {
  compilers: {
    solc: {
      version: "0.4.24",
    },
  },
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWallet(
          HYRO_MNEMONIC,
          "https://rinkeby.infura.io/v3/" + INFURA_KEY
        );
      },
      gasPrice: 94000000000,
      network_id: "*",
      skipDryRun: true,
    },
  },
};
