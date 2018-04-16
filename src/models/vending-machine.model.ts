import { IProductModel } from './product.model';

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

export class VendingMachineModel {

    private model: IVendingMachineModel;

    constructor(initialValues: IVendingMachineModel) {
        this.model = initialValues;
    }

    /**************************************************************************************
    * Gets Values for the model.
    *
    * @return { Void } void.
    **************************************************************************************/
    public getValues() {
        return this.model;
    }

    /**************************************************************************************
    * Sets Values for the model.
    *
    * @param { string } key
    * @param { string } value
    * @return { Void } void.
    **************************************************************************************/
    public setValues(key, value) {
        this.model[key] = value;
    }

    /**************************************************************************************
    * Validates payment is made and makes changes to model.
    *
    * @param { Function } callback
    * @return { Void } calls relevant function to process payment.
    **************************************************************************************/
    public validatePaymentConfirmation(callback): void {
        if (this.isProductSelectionPaymentValid()) {
            this.processInventory();
            this.purchaseProduct(callback);
            this.refundBalance(callback);
        }
    }

    /**************************************************************************************
    * Validates if necessary payment is made and returns boolean.
    *
    * @return { boolean } boolean.
    **************************************************************************************/
    private isProductSelectionPaymentValid(): boolean {
        return (this.model.selectedProduct &&
                this.model.balance >= this.model.selectedProduct.price);
    }


    /**************************************************************************************
    * Processes inventory balance (when successful transaction takes place).
    *
    * @return { Void } Void.
    **************************************************************************************/
    private processInventory(): void {
        // subtract balance
        this.model.balance = this.model.balance - this.model.selectedProduct.price;
        // subtract inventory
        this.model.selectedProduct.amount = this.model.selectedProduct.amount - 1;
    }

    /**************************************************************************************
    * Clears selection of selected (when processing is complete).
    *
    * @return { Void } Void.
    **************************************************************************************/
    private clearSelection(): void {
        return (this.model.selectedProduct = null);
    }

    /**************************************************************************************
    *  - Sends request to make a purchase request
    *  - Deducts information from product amount
    *
    * @param { Function } callback
    * @return { Function } calls relevant function to dispense product from machine.
    **************************************************************************************/
    private purchaseProduct(callback) {
        const result = {
            product: this.model.selectedProduct
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
    private refundBalance(callback): void | boolean {
        if (this.model.balance > 0) {
            const result = {
                refundAmount: this.model.balance
            };

            this.model.balance = 0;

            // ... call hardware to emit coins
            return callback(result);
        } else {
            return false;
        }
    }
}
