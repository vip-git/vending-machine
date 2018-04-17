/****
 * Todo:
 *  - Unit tests for this file to be covered using truffle framework
 *  - Example :
 *    - http://truffleframework.com/docs/getting_started/javascript-tests
 */
export class VendingMachineBlockChainModel {

    private web3: any;
    private contractInstance: any;

    constructor (blockchainCreds) {
        this.contractInstance = blockchainCreds.contractInstance;
        this.web3 = blockchainCreds.web3;
    }

    /**************************************************************************************
    * Sets Values for the model.
    *
    * @param { number } amount
    * @param { Function } successCallback
    * @param { Function } failureCallback
    * @param { Function } purchaseCallback
    * @param { Function } refundCallback
    * @return { Void } void.
    **************************************************************************************/
    /* istanbul ignore next */
    public insertCoinsViaBlockChain(amount, price, successCallback, failureCallback, purchaseCallback, refundCallback) {
        return this.contractInstance.insertCoins(amount, {from: this.web3.eth.accounts[0]}, (err, result) => {
            this.validatePaymentConfirmationViaBlockChain(price,
                                                          successCallback,
                                                          failureCallback,
                                                          purchaseCallback,
                                                          refundCallback);
        });
    }

    /**************************************************************************************
    * Sets Values for the model.
    *
    * @param { Object } product
    * @param { Function } successCallback
    * @param { Function } failureCallback
    * @param { Function } purchaseCallback
    * @param { Function } refundCallback
    * @return { Void } void.
    **************************************************************************************/
    /* istanbul ignore next */
    public selectProductViaBlockChain(product, successCallback, failureCallback, purchaseCallback, refundCallback) {
        return this.contractInstance.selectedProduct(product.productId, product.price,
                    {from: this.web3.eth.accounts[0]}, (err, result) => {
                        this.validatePaymentConfirmationViaBlockChain(product.price,
                                                                      successCallback,
                                                                      failureCallback,
                                                                      purchaseCallback,
                                                                      refundCallback);
                    });
    }

    /**************************************************************************************
    * Gets product price from blockchain server
    *
    * @param {} none
    * @return { Void } void.
    **************************************************************************************/
    /* istanbul ignore next */
    public getSelectedProductPriceViaBlockChain() {
        return parseInt(this.contractInstance.getSelectedProductPrice.call().toString(), 10) || 0;
    }

    /**************************************************************************************
    * Gets product id from blockchain server
    *
    * @param {} none
    * @return { Void } void.
    **************************************************************************************/
    /* istanbul ignore next */
    public getSelectedProductIdViaBlockChain() {
        return parseInt(this.contractInstance.getSelectedProductId.call().toString(), 10) || 0;
    }

    /**************************************************************************************
    * Gets balance from blockchain server
    *
    * @param { string } key
    * @param { string } value
    * @return { Void } void.
    **************************************************************************************/
    /* istanbul ignore next */
    public getBalanceViaBlockChain() {
        return parseInt(this.contractInstance.getBalance.call().toString(), 10);
    }

    /**************************************************************************************
    * Validates payment is made and makes changes to model.
    *
    * @param { number } price
    * @param { Function } successCallback
    * @param { Function } failureCallback
    * @param { Function } purchaseCallback
    * @param { Function } refundCallback
    * @return { Void } calls relevant function to process payment.
    **************************************************************************************/
    /* istanbul ignore next */
    public validatePaymentConfirmationViaBlockChain(price, success, failure, purchaseCallback, refundCallback): void {
        if (this.isProductSelectionPaymentValidViaBlockChain()) {
            this.processInventoryViaBlockChain();
            purchaseCallback(success);
            refundCallback(success);
        } else {
            failure();
        }
    }

    /* istanbul ignore next */
    private isProductSelectionPaymentValidViaBlockChain () {
        return (this.contractInstance.validatePayment.call().toString() === 'true');
    }

    /* istanbul ignore next */
    private processInventoryViaBlockChain () {
        return this.contractInstance.processInventory({from: this.web3.eth.accounts[0]});
    }
}