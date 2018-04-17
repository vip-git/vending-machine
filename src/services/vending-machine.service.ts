// Models
import { VendingMachineModel, IVendingMachineModel } from '../models/vending-machine.model';
import { ProductModel, IProductModel } from '../models/product.model';

// Mocks
import { ProductsMockData } from '../mocks/product-data.mock';

/************************************************************************************************
 ** Following functions needed : ****************************************************************
 **   • Retrieve and show all products in a single list.
 **       • getAllProduct  (function that gets all product)
 **   • Accept user input for selecting a product.
 **       • makeSelection (function that calls getProductDetails)
 **   • Show the price for a selected product.
 **       • getProduct (function that retrieves information about the product)
 **   • Accept user input for paying for the selected product.
 **       • deposit (function that retrieves information on buying the product)
 **   • Display the purchased product.
 **       • vendingMachineModel.validatePaymentConfirmation (function that confirms payment is made successfully)
 ***********************************************************************************************/
export class VendingMachineService {

  private vendingMachineModel: VendingMachineModel;
  private productModel: ProductModel;

  constructor(values: IVendingMachineModel, blockchainCreds: any = false) {
    this.vendingMachineModel = new VendingMachineModel(values, blockchainCreds);
    this.productModel = new ProductModel(ProductsMockData);
  }

  /**************************************************************************************
  * Gets current vending machine values.
  *
  * @return {IVendingMachineModel} IVendingMachineModel
  **************************************************************************************/
  public getVendingMachineValues(): IVendingMachineModel {
    return this.vendingMachineModel.getValues();
  }

  /**************************************************************************************
  * Gets all product information from product model.
  *
  * @return {IProductModel[]} IProductModel[]
  **************************************************************************************/
  public getAllProducts(): IProductModel[] {
    return this.productModel.getAllProducts();
  }

  /**************************************************************************************
  * Deposits money and adds to the balance.
  *
  * @param {integer} amount
  * @param {Function} callback
  * @return {Function} to validate payment.
  **************************************************************************************/
  public deposit(amount, successCallback, failureCallback): void | boolean {
    if (this.getVendingMachineValues().coins.indexOf(amount) === -1) { return false; }
    return this.vendingMachineModel.insertCoins(amount, successCallback, failureCallback);
  }

  /**************************************************************************************
  * Makes selection of the product.
  *
  * @param {integer} productId
  * @param {Function} callback
  * @return {boolean}
  **************************************************************************************/
  public makeSelection(productId, successCallback, failureCallback): void | boolean {
    if (this.doesProductExists(productId)) {
      return this.vendingMachineModel.selectProduct(this.getProduct(productId), successCallback, failureCallback);
    } else {
      return false;
    }
  }

  public doesProductExists(selection): boolean {
    return (this.getAllProducts().length > selection && selection > 0);
  }

  /**************************************************************************************
  * Gets specific product information from all available products.
  *
  * @param {integer} productId
  * @return {IProductModel} IProductModel
  **************************************************************************************/
  private getProduct(productId): IProductModel {
    return this.getAllProducts().find((product, index) => product.productId === productId);
  }
}
