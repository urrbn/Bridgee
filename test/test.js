const { expect } = require("chai");
const { ethers } = require("hardhat");
const contractBridge = require("../artifacts/contracts/Bridge.sol/Bridge.json");

describe("Greeter", function () {
  before(async function () {
    const provider = ethers.provider;
    this.signers = await ethers.getSigners()
    this.owner = this.signers[0]
    this.alice = this.signers[1]
    this.bob = this.signers[2]

    const Bridge = await ethers.getContractFactory("Bridge");
    this.bridge = await Bridge.deploy();
    await this.bridge.deployed();

    const Bridge2 = await ethers.getContractFactory("Bridge");
    this.bridgeBsc = await Bridge2.deploy();
    await this.bridgeBsc.deployed();

    const Token = await ethers.getContractFactory("Token");
    this.token = await Token.deploy('bsc', 'bsc');
    await this.token.deployed();

    const Token2 = await ethers.getContractFactory("Token");
    this.tokenBsc = await Token2.deploy("token", 'tkn');
    await this.tokenBsc.deployed();

    await console.log(this.tokenBsc.address, "bsc")
    await console.log(this.token.address)



  });

  it("should", async function (){
    const provider = ethers.provider;
    const bscBridge = new ethers.Contract(this.bridgeBsc.address , contractBridge.abi , provider)
    const ethBridge = new ethers.Contract(this.bridge.address , contractBridge.abi , provider)

    const filter1 = bscBridge.filters.SwapInitialized()
    const filter2 = ethBridge.filters.SwapInitialized()
    
    bscBridge.on('SwapInitialized', (from, to, amount, ticker, chainTo, chainFrom, nonce) => console.log(from, to, amount, ticker, chainTo, chainFrom, nonce))
    bscBridge.connect(this.alice).swap(this.alice.address, 1000000, "tkn", 9, 9)
    
    let listeners =  bscBridge.listeners("SwapInitialized")
    console.log(listeners)
    
  })
});
