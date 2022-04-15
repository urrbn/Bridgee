require("@nomiclabs/hardhat-ethers");
const { ethers } = require("ethers");
const contract = require("../artifacts/contracts/Bridge.sol/Bridge.json");

task("redeem", "redeem")
  .addParam("from" , "The amount you want to swap")
  .addParam("amount" , "The amount you want to swap")
  .addParam("to" , "Address to")
  .addParam("ticker" , "Ticker")
  .addParam("chainTo" , "Chain to")
  .addParam("chainFrom" , "Chain from")
  .addParam("nonce" , "Nonce")
  .addParam("signature" , "Sig")
  .setAction(async (taskArgs) => {
    const RINKEBY_URL = process.env.RINKEBY_URL;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const API_KEY = process.env.API_KEY;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;  

    const infuraProvider = new ethers.providers.InfuraProvider(network = "rinkeby", API_KEY);
    const signer = new ethers.Wallet(PRIVATE_KEY, infuraProvider);
    const bridge = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

    const ethProvider = new hre.ethers.providers.WebSocketProvider(process.env.RINKEBY_WS);
    const bnbProvider = new hre.ethers.providers.WebSocketProvider(process.env.BINANCE_WS);
    const filter = bridge.filters.Redeemed(
      process.env.SIGNER_PUBLIC_KEY, taskArguments.to, null, null, null, null, null
    );
    ethProvider.on(filter, (event) => console.log(event));
    bnbProvider.on(filter, (event) => console.log(event));
    const redeemTx = await bridge.redeem(
        taskArguments.from,
        taskArguments.to, 
        taskArguments.amount, 
        taskArguments.ticker,
        taskArguments.chainFrom,
        taskArguments.chainTo,
        taskArguments.nonce,
        taskArguments.signature,
      );
    
    console.log(redeemTx);
  });

module.exports = {};

