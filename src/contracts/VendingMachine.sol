pragma solidity ^0.4.21;
pragma experimental ABIEncoderV2;
// We have to specify what version of compiler this code will compile with

contract VendingMachine {
  /* mapping field below is equivalent to an associative array or hash.
  The key of the mapping is candidate name stored as type bytes32 and value is
  an unsigned integer to store the vote count
  */
  
  bytes32[] public products;

  uint8 public balance;
  uint8 public selectedProductId;
  uint8 public selectedPrice;
  

  /* This is the constructor which will be called once when you
  deploy the contract to the blockchain. When we deploy the contract,
  we will pass an array of candidates who will be contesting in the election
  */
  function VendingMachine(bytes32[] productsList) public {
    products = productsList;
  }

  // This function returns the total votes a candidate has received so far
  function getBalance() view public returns (uint8) {
    return balance;
  }

  // This function returns the total votes a candidate has received so far
  function getSelectedProductId() view public returns (uint8) {
    return selectedProductId;
  }
  // This function returns the total votes a candidate has received so far
  function getSelectedProductPrice() view public returns (uint8) {
    return selectedPrice;
  }

  // This function returns the total votes a candidate has received so far
  function selectedProduct(uint8 productId, uint8 price) public {
    selectedProductId = productId;
    selectedPrice = price;
  }

  // This function returns the total votes a candidate has received so far
  function insertCoins(uint8 amount) public {
    balance += amount;
  }

  // This function increments the vote count for the specified candidate. This
  // is equivalent to casting a vote
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