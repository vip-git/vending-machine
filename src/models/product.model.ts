export interface IProductModel {
    productId: number;
    name: string;
    amount: number;
    category: string;
    price: number;
    attributes: Array<{}>;
    getAllProducts?: () => IProductModel[];
}

export class ProductModel {

    private model: IProductModel[];

    constructor(initialValues: IProductModel[]) {
        this.model = initialValues;
    }

    /**************************************************************************************
    * Gets all product information and filters which are unavailable.
    *
    * @return { Void } void.
    **************************************************************************************/
    public getAllProducts(): IProductModel[] {
        return this.model.filter(product => product.amount > 0);
    }
}
