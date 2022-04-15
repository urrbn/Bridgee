
const hre = require("hardhat");

async function main() {

  const Bridge = await ethers.getContractFactory("Bridge");
  this.bridge = await Bridge.deploy();
  await this.bridge.deployed();

  const Token = await ethers.getContractFactory("Token");
  this.token = await Token.deploy('tkn', 'tkn');
  await this.token.deployed();
  console.log(this.bridge.address)
  console.log(this.token.address)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
