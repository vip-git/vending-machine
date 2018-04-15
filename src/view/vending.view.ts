// Library
import * as prompt from 'prompt';

// Services
import { VendingMachineService } from './../service/vending-machine.service';

export class VendingView {

    private vendingService: VendingMachineService;
    private amountSpent: number;

    constructor () {
        prompt.start({noHandleSIGINT: true});
        this.vendingService = new VendingMachineService();
        this.amountSpent = 0;
        this.askToSelectProductFromMachine();
    }

    /**
     * Description :
     *  - Selects product from given list
     *  - takes id as parameter
     *  - returns product
     */
    private getProductDetails(product) {
        let schema = {
            properties: {
                amount: {
                    description: 'Please enter the amount to buy ' + product.name +
                    ' (Current Price: ' + product.price + ' and you paid ' + this.amountSpent + ')',
                    pattern: /^[0-9\s\-]+$/,
                    message: 'Amount must be only contain numbers',
                    required: true
                }
            }
        };

        prompt.get(schema, (err, result) => {
            if (err) { prompt.stop(); }
            const amount = parseInt(result.amount, 10);
            this.amountSpent = this.amountSpent + amount;

            console.info('\x1b[36m%s\x1b[0m', 'Total Amount paid: ' + this.amountSpent);

            this.vendingService.deposit(amount);
            return (this.amountSpent < product.price) ? this.getProductDetails(product) :
                    this.vendingService.validatePaymentConfirmation();
        });
    }

    /**
     * Description :
     *  - Asks to Selects product from given list
     *  - returns product
     */
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

        prompt.get(schema, (err, result) => {
            if (err) { prompt.stop(); }

            console.info('\x1b[33m%s\x1b[0m', 'Please select 1 product from below: ');
            this.vendingService.products.forEach((value, index) => {
                console.info('\x1b[32m%s\x1b[0m', '[' + value.productId + '] ' + value.name + ' for €' + value.price);
            });

            if (this.vendingService.makeSelection(parseInt(result.productId, 10)) === 'invalid') {
                this.askToSelectProductFromMachine();
            } else {
                console.info('\x1b[36m%s\x1b[0m', 'Product Selected: ' +
                this.vendingService.vendingMachine.selectedProduct.name);
                return this.getProductDetails(this.vendingService.vendingMachine.selectedProduct);
            }
        });
    }
}
