export interface IProductModel {
    productId: number;
    name: string;
    amount: number;
    category: string;
    price: number;
    attributes: Array<{}>;
}

export class ProductModel implements IProductModel {
    get name(): string {
        return this.name;
    }

    set name(value) {
        this.name = value;
    }

    get productId(): number {
        return this.productId;
    }

    set productId(value) {
        this.productId = value;
    }

    get amount(): number {
        return this.amount;
    }

    set amount(value) {
        this.amount = value;
    }

    get category(): string {
        return this.category;
    }

    set category(value) {
        this.category = value;
    }

    get price(): number {
        return this.price;
    }

    set price(value) {
        this.price = value;
    }

    get attributes(): Array<{}> {
        return this.attributes;
    }

    set attributes(value) {
        this.attributes = value;
    }
}
