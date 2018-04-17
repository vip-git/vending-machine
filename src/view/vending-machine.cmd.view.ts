// Library
import * as prompt from 'prompt';

// Services
import { VendingMachineService } from './../services/vending-machine.service';

export class VendingMachineCMDView {

    private vendingService: VendingMachineService;

    constructor (blockchainCreds: any = false) {
        prompt.start({noHandleSIGINT: true});
        this.vendingService = new VendingMachineService({
            balance: 0,
            coins: [1, 2, 5, 10, 20, 50],
            selectedProduct: null,
            createdAt: Date.now()
        }, blockchainCreds);
        this.askToSelectProductFromMachine();
    }

    /*****************************************************************************************
    * Processes the payment and calls relevant hardware functions to dispense the product and
    * refunds the money. (Right now for the time being just console logs)
    *
    * @param {Object} result
    * @return {Void} void
    **************************************************************************************/
    private processPayment = (result): void => {
        if (result && result.product && result.product.name) {
            console.info('\x1b[36m%s\x1b[0m', 'Dispensing ' + result.product.name);
        }

        if (result && result.refundAmount) {
            console.info('\x1b[36m%s\x1b[0m', 'Refunding ' + result.refundAmount);
        }
    }

    /**************************************************************************************
    * Asks to select a product from given list :
    * if not the correct amount - it will ask to try again.
    * if correct - it will print out results and refund extra money if applicable.
    *
    * @param {Object} product
    * @return {Function} next prompt being called or similar prompt if there is an error.
    **************************************************************************************/
    private getProductDetails = (product): void => {
        product = (!product) ? this.vendingService.getVendingMachineValues().selectedProduct : product;
        let schema = {
            properties: {
                amount: {
                    description: 'Insert Money to buy your product ' + product.name +
                    ' (Current Price: ' + product.price + ') \n Coins Supported:' +
                    this.vendingService.getVendingMachineValues().coins.toString(),
                    pattern: /^(1|2|5|10|20|50)$/,
                    message: 'Coin Unsupported - Please try again',
                    required: true
                }
            }
        };

        prompt.get(schema, (err, result) => {
            if (err) { prompt.stop(); }
            const amount = parseInt(result.amount, 10);
            const amountPaid = this.vendingService.getVendingMachineValues().balance + amount;
            console.info('\x1b[36m%s\x1b[0m', 'Total Amount paid: ' + amountPaid);
            this.vendingService.deposit(amount, this.processPayment, this.getProductDetails);
        });
    }

    /**************************************************************************************
    * Prints all products for selection :
    * if product stock is over - it will ask to try again.
    * if product is available - it will print it as part of the list.
    *
    * @param {} none
    * @return {void} only prints the message
    **************************************************************************************/
    private printProductSelection() {
        if (this.vendingService &&
            this.vendingService.getAllProducts() &&
            this.vendingService.getAllProducts().length) {
            console.info('\x1b[33m%s\x1b[0m', 'Please select a product from list: ');
            this.vendingService.getAllProducts().forEach(function(value, index) {
                console.info('\x1b[32m%s\x1b[0m', '[' + value.productId + '] ' + value.name + ' for €' + value.price);
            });
        } else {
            console.info('\x1b[33m%s\x1b[0m', 'All products are out of stock - Try Again later');
        }
    }

    private processSelection = (): void => {
        console.info('\x1b[36m%s\x1b[0m', 'Product Selected: ' +
        this.vendingService.getVendingMachineValues().selectedProduct.name);
        return this.getProductDetails(this.vendingService.getVendingMachineValues().selectedProduct);
    }


    /**************************************************************************************
    * Asks user to select products from machine :
    * if incorrect (not in the list) - it will ask to try again.
    * if correct (in the list) - it will ask for amount to be paid.
    *
    * @param {} none
    * @return {void} only prints the message
    **************************************************************************************/
    private askToSelectProductFromMachine() {
        let schema = {
            properties: {
                productId: {
                    description: 'Select a product from the list',
                    pattern: /^[0-9\s\-]+$/,
                    message: 'Product must be only be numbers',
                    required: true
                }
            }
        };

        this.printProductSelection();

        prompt.get(schema, (err, result) => {
            if (err) { prompt.stop(); }
            if (!this.vendingService.doesProductExists(result.productId)) {
                console.info('\x1b[31m%s\x1b[0m', 'Invalid Product Selected - Please Try Again');
                this.askToSelectProductFromMachine();
            } else {
                return this.vendingService.makeSelection(parseInt(result.productId, 10), this.processPayment, this.processSelection);
            }
        });
    }
}
