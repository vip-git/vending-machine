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
    * @param { string } key
    * @param { string } value
    * @return { Void } void.
    **************************************************************************************/
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
    * @param { string } key
    * @param { string } value
    * @return { Void } void.
    **************************************************************************************/
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
    * Gets Values for the model.
    *
    * @param { string } key
    * @param { string } value
    * @return { Void } void.
    **************************************************************************************/
    public getSelectedProductPriceViaBlockChain() {
        return parseInt(this.contractInstance.getSelectedProductPrice.call().toString(), 10) || 0;
    }

    /**************************************************************************************
    * Gets Values for the model.
    *
    * @param { string } key
    * @param { string } value
    * @return { Void } void.
    **************************************************************************************/
    public getSelectedProductIdViaBlockChain() {
        return parseInt(this.contractInstance.getSelectedProductId.call().toString(), 10) || 0;
    }

    /**************************************************************************************
    * Gets Values for the model.
    *
    * @param { string } key
    * @param { string } value
    * @return { Void } void.
    **************************************************************************************/
    public getBalanceViaBlockChain() {
        return parseInt(this.contractInstance.getBalance.call().toString(), 10);
    }

    /**************************************************************************************
    * Validates payment is made and makes changes to model.
    *
    * @param { Function } callback
    * @return { Void } calls relevant function to process payment.
    **************************************************************************************/
    public validatePaymentConfirmationViaBlockChain(price, success, failure, purchaseCallback, refundCallback): void {
        if (this.isProductSelectionPaymentValidViaBlockChain()) {
            this.processInventoryViaBlockChain();
            purchaseCallback(success);
            refundCallback(success);
        } else {
            failure();
        }
    }

    private isProductSelectionPaymentValidViaBlockChain () {
        return (this.contractInstance.validatePayment.call().toString() === 'true');
    }

    private processInventoryViaBlockChain () {
        return this.contractInstance.processInventory({from: this.web3.eth.accounts[0]});
    }
}