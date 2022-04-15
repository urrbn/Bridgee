const { expect } = require("chai");
const { ethers } = require("hardhat");
const contractBridge = require("../artifacts/contracts/Bridge.sol/Bridge.json");

describe("Bridge", function () {
  before(async function () {
    const provider = ethers.provider;
    this.signers = await ethers.getSigners()
    this.owner = this.signers[0]
    this.alice = this.signers[1]
    this.bob = this.signers[2]

    const Bridge = await ethers.getContractFactory("Bridge");
    this.bridge = await Bridge.deploy();
    await this.bridge.deployed();

    const Token = await ethers.getContractFactory("Token");
    this.token = await Token.deploy('tkn', 'tkn');
    await this.token.deployed();
    console.log(this.alice.address)
  });

  it("should emit swapInitialized", async function (){
    await this.bridge.includeToken('tkn', this.token.address)
    let chainFrom = 2
    let chainTo = 1
    await this.bridge.updateChainById(chainFrom, true)
    await this.bridge.updateChainById(chainTo, true)
    await this.bridge.swap(this.owner.address, 100000000, 'tkn', chainTo, chainFrom)
    await expect(this.bridge.swap(this.owner.address, 100000000, 'tkn', chainTo, chainFrom)).to.emit(this.bridge, "SwapInitialized").withArgs(this.owner.address, this.owner.address, 100000000, 'tkn', chainFrom, chainTo, 1)
    
  })

  it("Should emit 'Redeemed'", async function (){
    let chainFrom = 2
    let chainTo = 1

    const message = ethers.utils.solidityKeccak256(
      ["address", "address", "uint256", "string", "uint256", "uint256", "uint256"],
      [this.owner.address, this.owner.address, 100000000, 'tkn', chainFrom, chainTo, 0]
    );

    const signature = await this.owner.signMessage(ethers.utils.arrayify(message));

    await expect(this.bridge.redeem(this.owner.address, this.owner.address, 100000000, 'tkn', chainFrom, chainTo, 0, signature)).to.emit(this.bridge, "Redeemed").withArgs(this.owner.address, this.owner.address, 100000000, 'tkn', chainFrom, chainTo, 0)
  })
});
