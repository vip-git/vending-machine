pragma solidity ^0.4.21;
pragma experimental ABIEncoderV2;
// We have to specify what version of compiler this code will compile with

contract VendingMachine {
  bytes32[] public products;

  uint8 public balance;
  uint8 public selectedProductId;
  uint8 public selectedPrice;
  

  /* This is the constructor which will be called once when you
  deploy the contract to the blockchain. When we deploy the contract,
  we will pass an array of products which will available as options
  */
  function VendingMachine(bytes32[] productsList) public {
    products = productsList;
  }

  function getBalance() view public returns (uint8) {
    return balance;
  }

  function getSelectedProductId() view public returns (uint8) {
    return selectedProductId;
  }
  
  function getSelectedProductPrice() view public returns (uint8) {
    return selectedPrice;
  }

  function selectedProduct(uint8 productId, uint8 price) public {
    selectedProductId = productId;
    selectedPrice = price;
  }

  function insertCoins(uint8 amount) public {
    balance += amount;
  }

  function processInventory() public returns (uint8) {
    balance -= selectedPrice;
    return balance;
  }

  function validatePayment() view public returns (bool) {
    if (balance >= selectedPrice) {
        return true;
    }
    return false;
  }
}