pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  address public owner;

  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    owner = msg.sender;
    _mint(msg.sender, 1000000 * (10**18));
  }

  function mint(address to, uint amount) external {
    _mint(to, amount);
  }

  function burn(address from, uint amount) external {
    _burn(from, amount);
  }
}
