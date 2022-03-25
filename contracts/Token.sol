pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  address public owner;

  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    owner = msg.sender;
  }

  function mint(address to, uint amount) external {
    require(msg.sender == owner, "only owner");
    _mint(to, amount);
  }

  function burn(address from, uint amount) external {
    require(msg.sender == owner, "only owner");
    _burn(from, amount);
  }
}
