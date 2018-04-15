import { IProductModel } from './product.model';

export interface IVendingMachineModel {
    coins: number;
    userId: number;
    balance: number;
    selectedProduct: IProductModel;
    createdAt: number;
}

export class VendingMachineModel implements IVendingMachineModel {

    get userId(): number {
        return this.userId;
    }

    set userId(value) {
        this.userId = value;
    }

    get coins(): number {
        return this.coins;
    }

    set coins(value) {
        this.coins = value;
    }

    get balance(): number {
        return this.balance;
    }

    set balance(value) {
        this.balance = value;
    }

    get selectedProduct(): iProductModel {
        return this.selectedProduct;
    }

    set selectedProduct(value) {
        this.selectedProduct = value;
    }
    
    get createdAt(): number {
        return this.createdAt;
    }

    set createdAt(value) {
        this.createdAt = value;
    }
}
