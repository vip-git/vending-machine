// Models
import {
  UserModel,
  VendingMachineModel,
  ProductModel
} from '../models/index';

// Mocks
import { ProductsMockData } from './product-data.mock';

/************************************************************************************************
 ** Following functions needed : ****************************************************************
 **   • Retrieve and show all products in a single list.
 **       • getAllProduct  (function that gets all product)
 **   • Accept user input for selecting a product.
 **       • selectProductFromMachine (function that calls getProductDetails)
 **   • Show the price for a selected product.
 **       • getProductDetails (function that retrieves information about the product)
 **   • Accept user input for paying for the selected product.
 **       • purchaseProduct (function that retrieves information on buying the product)
 **   • Display the purchased product.
 **       • validatePaymentConfirmation (function that confirms payment is made successfully)
 ***********************************************************************************************/
export class VendingMachineService {

  public vendingMachine: VendingMachineModel;
  public products: ProductModel[];

  constructor() {
    // Initialize products setup
    this.products = this.getAllProducts();

    // Initialize vendingMachine setup
    this.vendingMachine = {
      balance: 0,
      coins: 0,
      userId: 0,
      selectedProduct: null,
      createdAt: 0
    };
  }

  /**
   * Description :
   *  - Deposits money and adds to the balance.
   */
  public deposit(amount) {
    this.vendingMachine.balance = this.vendingMachine.balance + amount;
    this.validatePaymentConfirmation();
  }

  /**
   * Description :
   *  - Makes selection and calls purchase product
   */
  public makeSelection(productId) {
    if (this.getProduct(productId)) {
      this.vendingMachine.selectedProduct = this.getProduct(productId);
      this.validatePaymentConfirmation();
    } else {
      console.info('\x1b[31m%s\x1b[0m', 'Invalid Product Selected - Please Try Again');
      return 'invalid';
    }
  }

  /**
   * Description :
   *  - Validates payment is made
   *  - takes id as parameter
   *  - returns confirmation
   */
  public validatePaymentConfirmation() {
    if (this.vendingMachine && this.vendingMachine.selectedProduct &&
          this.vendingMachine.balance >= this.vendingMachine.selectedProduct.price) {

      // subtract balance
      this.vendingMachine.balance = this.vendingMachine.balance - this.vendingMachine.selectedProduct.price;

      // subtract inventory
      this.vendingMachine.selectedProduct.amount = this.vendingMachine.selectedProduct.amount - 1;

      this.purchaseProduct(this.vendingMachine.selectedProduct);

      // clear the selection
      this.vendingMachine.selectedProduct = null;

      this.refundBalance();
    }
  }

 /**
  * Description :
  *  - Gets all product information.
  *  - sorts them in the right order
  */
  private getAllProducts() {
    return ProductsMockData;
  }

 /**
  * Description :
  *  - Gets all product information.
  *  - sorts them in the right order
  */
  private getProduct(productId): ProductModel {
    return this.products.find((product, index) => product.productId === productId);
  }

  /**
   * Description :
   *  - Refund balance if the transaction is cancelled.
   */
  private refundBalance() {
    if (this.vendingMachine.balance > 0) {
      const refundAmount = this.vendingMachine.balance;
      this.vendingMachine.balance = 0;

      // ... call hardware to emit coins
      console.info('\x1b[36m%s\x1b[0m', 'Refunding ' + refundAmount);
    }
  }

  /**
   * Description :
   *  - Sends request to make a purchase request
   *  - deducts information from product amount
   *  - takes id as parameter
   *  - returns paymentId
   */
  private purchaseProduct(product) {
    // ... call hardware to dispense drink
    console.info('\x1b[36m%s\x1b[0m', 'Dispensing ' + product.name);
  }
}
