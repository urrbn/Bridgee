pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IToken.sol";

contract Bridge{
  address public validator;
  mapping(bytes32 => bool) public processedHashes;
  mapping(string => address) public TickerToToken;
  mapping(uint256 => bool) public activeChainIds;

  event SwapInitialized(
    address from,
    address to,
    uint256 amount,
    string ticker,
    uint256 chainTo,
    uint256 chainFrom,
    uint256 nonce
  );

  constructor() {
    validator = msg.sender;
  }

  function swap(address to, uint256 amount, string memory ticker, uint256 nonce, uint256 chainTo) external {
    require(processedHashes[keccak256(abi.encodePacked(to, amount, nonce))] == false, "transfer already processed");
    uint256 chainFrom = getChainID();
    bytes32 hash_ = keccak256(abi.encodePacked(to, amount, nonce));
    
    processedHashes[hash_] = true;
    address token = TickerToToken[ticker];
    IToken(token).burn(msg.sender, amount);
    emit SwapInitialized(
      msg.sender,
      to,
      amount,
      ticker,
      chainFrom,
      chainTo,
      nonce
    );
  }

  function redeem(address addr, uint256 val, uint8 v, bytes32 r, bytes32 s , string memory ticker, uint256 chainFrom, uint256 nonce) public {
    uint256 chainTo = getChainID();

    require(chainFrom != chainTo, "invalid chainTo");
    require(activeChainIds[chainFrom], "chain is not active :(");

    bytes32 message = keccak256(abi.encodePacked(addr, val));
    address account = ecrecover(hashMessage(message), v, r, s);
    if(account == validator){
        address token = TickerToToken[ticker];
        IToken(token).burn(msg.sender, val);  
    }else {
        revert("invalid signatue");
    }
  }
   
  function hashMessage(bytes32 message) private pure returns (bytes32){
      bytes memory prefix = "\x19Ethereum Signed Message:\n32";
      return keccak256(abi.encodePacked(prefix, message));
  } 

  function getChainID() internal view returns (uint256) {
    uint256 id;
    assembly {
        id := chainid()
    }
    return id;
  }

  function updateChainById(uint256 chainId, bool isActive) external view {
      require(msg.sender == validator, "only owner");
      activeChainIds[chainId] == isActive;
  }

  function includeToken(string memory ticker, address addr) external{
      require(msg.sender == validator, "only owner");
      TickerToToken[ticker] = addr;
  }

  function excludeToken(string memory ticker) external{
      require(msg.sender == validator, "only owner");
      delete TickerToToken[ticker];
  }
  
}