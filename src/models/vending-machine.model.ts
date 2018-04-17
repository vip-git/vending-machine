import { IProductModel } from './product.model';
import { VendingMachineBlockChainModel } from './vending-machine.blockchain.model';

export enum coinsEnum {
    '1 euro'   = 1,
    '2 euros'  = 2,
    '5 euros'  = 5,
    '10 euros' = 10,
    '20 euros' = 20,
    '50 euros' = 50
}

export interface IVendingMachineModel {
    coins: coinsEnum[];
    balance: number;
    selectedProduct: IProductModel;
    createdAt: number;
    validatePaymentConfirmation?: (callback) => void;
    getValues?: () => IVendingMachineModel;
    purchaseProduct?: () => void;
}

export class VendingMachineModel extends VendingMachineBlockChainModel {

    private static data: IVendingMachineModel;
    private static isBlockChainEnabled: boolean;

    constructor(initialValues: IVendingMachineModel, blockchainCreds: any) {
        super(blockchainCreds);
        VendingMachineModel.data = initialValues;
        VendingMachineModel.isBlockChainEnabled = (blockchainCreds && blockchainCreds.web3 && blockchainCreds.contractInstance);
    }

    /**************************************************************************************
    * Gets Values for the model.
    *
    * @return { Void } void.
    **************************************************************************************/
    /* istanbul ignore next */
    public getValues() {
        if (VendingMachineModel.isBlockChainEnabled) {
            VendingMachineModel.data.balance = this.getBalanceViaBlockChain();
            if (VendingMachineModel.data && VendingMachineModel.data.selectedProduct) {
                VendingMachineModel.data.selectedProduct.productId = this.getSelectedProductIdViaBlockChain();
                VendingMachineModel.data.selectedProduct.price = this.getSelectedProductPriceViaBlockChain();
            }
        }
        return VendingMachineModel.data;
    }

    public insertCoins(amount, success, failure) {
        return (VendingMachineModel.isBlockChainEnabled) ? this.insertCoinsViaBlockChain(amount,
                                                                VendingMachineModel.data.selectedProduct.price,
                                                                success, failure, this.purchaseProduct,
                                                                this.refundBalance)
                                                         : this.setValues('balance',
                                                            VendingMachineModel.data.balance + amount,
                                                            this.validatePaymentConfirmation,
                                                            success, failure);
    }

    public selectProduct(product, success, failure) {
        this.setValues('selectedProduct', product);
        return (VendingMachineModel.isBlockChainEnabled) ? this.selectProductViaBlockChain(product,
                                                            success, failure, this.purchaseProduct,
                                                            this.refundBalance)
                                                         : this.validatePaymentConfirmation(success, failure);
    }

    /**************************************************************************************
    * Validates payment is made and makes changes to model.
    *
    * @param { Function } callback
    * @return { Void } calls relevant function to process payment.
    **************************************************************************************/
    /* istanbul ignore next */
    public validatePaymentConfirmation = (success, failure): void => {
        if (VendingMachineModel.isBlockChainEnabled) {
            this.validatePaymentConfirmationViaBlockChain(VendingMachineModel.data.selectedProduct.price,
            success, failure, this.purchaseProduct, this.refundBalance);
            return;
        }

        if (this.isProductSelectionPaymentValid()) {
            this.processInventory();
            this.purchaseProduct(success);
            this.refundBalance(success);
        } else {
            failure();
        }
    }

    /**************************************************************************************
    * Validates if necessary payment is made and returns boolean.
    *
    * @return { boolean } boolean.
    **************************************************************************************/
    private isProductSelectionPaymentValid(): boolean {
        return (VendingMachineModel.data.selectedProduct &&
                VendingMachineModel.data.balance >= VendingMachineModel.data.selectedProduct.price);
    }


    /**************************************************************************************
    * Processes inventory balance (when successful transaction takes place).
    *
    * @return { Void } Void.
    **************************************************************************************/
    private processInventory(): void {
        // subtract balance
        VendingMachineModel.data.balance = VendingMachineModel.data.balance - VendingMachineModel.data.selectedProduct.price;
        // subtract inventory
        VendingMachineModel.data.selectedProduct.amount = VendingMachineModel.data.selectedProduct.amount - 1;
    }


    /**************************************************************************************
    * Sets Values for the model.
    *
    * @param { string } key
    * @param { string } value
    * @return { Void } void.
    **************************************************************************************/
    private setValues(key, value, callback: any = false, successCallback: any = false, failureCallback: any = false) {
        VendingMachineModel.data[key] = value;

        if (callback) {
            callback(successCallback, failureCallback);
        }
    }

    /**************************************************************************************
    * Clears selection of selected (when processing is complete).
    *
    * @return { Void } Void.
    **************************************************************************************/
    private clearSelection(): void {
        return (VendingMachineModel.data.selectedProduct = null);
    }

    /**************************************************************************************
    *  - Sends request to make a purchase request
    *  - Deducts information from product amount
    *
    * @param { Function } callback
    * @return { Function } calls relevant function to dispense product from machine.
    **************************************************************************************/
    private purchaseProduct = (callback) => {
        const result = {
            product: VendingMachineModel.data.selectedProduct
        };

        this.clearSelection();

        // ... call hardware to dispense drink
        return callback(result);
    }

    /**************************************************************************************
    * Refund balance if the transaction is cancelled or overpaid.
    *
    * @param { Function } callback
    * @return { Void } calls relevant function to process payment.
    **************************************************************************************/
    private refundBalance = (callback): void | boolean => {
        if (this.getValues().balance > 0) {
            const result = {
                refundAmount: VendingMachineModel.data.balance
            };

            VendingMachineModel.data.balance = 0;

            // ... call hardware to emit coins
            return callback(result);
        } else {
            return false;
        }
    }
}
