// Library
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as chaiSpies from 'chai-spies';

// Service
import { VendingMachineService } from '../vending-machine.service';

// Models
import { VendingMachineModel } from '../../models/vending-machine.model';
import { ProductModel } from '../../models/product.model';

// Mocks
import { ProductsMockData } from '../../mocks/product-data.mock';

// testing inits
chai.use(chaiSpies);
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();

describe('Vending Service Specs', () => {
  let vendingService: any;

  let callback = function() { };

  beforeEach(() => {
    vendingService = new VendingMachineService({
                          balance: 0,
                          coins: [1, 2, 5, 10, 20, 50],
                          selectedProduct: null,
                          createdAt: Date.now()
                      });
    chai.spy.on(vendingService.vendingMachineModel, 'validatePaymentConfirmation');
    chai.spy.on(vendingService.vendingMachineModel, 'purchaseProduct');
    chai.spy.on(vendingService.vendingMachineModel, 'clearSelection');
    chai.spy.on(vendingService.vendingMachineModel, 'refundBalance');
  });

  it('should be able to check initial state', () => {
    // // check initial state
    expect(vendingService.vendingMachineModel.getValues().balance).to.equal(0);
    expect(vendingService.vendingMachineModel.getValues().selectedProduct).to.equal(null);
    expect(vendingService.getAllProducts()).to.eql(ProductsMockData.filter(product => product.amount > 0));
    expect(vendingService.getVendingMachineValues()).to.eql(vendingService.vendingMachineModel.getValues());
  });

  it('should be able to deposit money', () => {
    // should not be able to deposit with invalid coins.
    expect(vendingService.deposit(25)).to.equal(false);

    // should be able to deposit with valid coins [1, 2, 5, 10, 20, 50]
    vendingService.deposit(20);
    expect(vendingService.vendingMachineModel.getValues().balance).to.equal(20);
  });

  it('should be able to make selection', () => {
    // buy a coke with exact change
    vendingService.deposit(50);

    expect(vendingService.getProduct(1).amount).to.equal(10);
    expect(vendingService.vendingMachineModel.getValues().balance).to.equal(50);

    // try selecting a invalid product
    expect(vendingService.makeSelection(123424)).to.equal(false);

    vendingService.makeSelection(1, callback);
    expect(vendingService.getProduct(1).amount).to.equal(9);
    expect(vendingService.vendingMachineModel.purchaseProduct).to.have.been.called.with(callback);
    expect(vendingService.vendingMachineModel.clearSelection).to.have.been.called();
  });

  it('should be able to deposit money after selection is done', () => {
    vendingService.deposit(20);
    expect(vendingService.getProduct(1).amount).to.equal(9);
    expect(vendingService.vendingMachineModel.getValues().balance).to.equal(20);
    expect(vendingService.vendingMachineModel.getValues().selectedProduct).to.equal(null);

    // make a selection first, put in extra money
    vendingService.makeSelection(1, callback);
    expect(vendingService.vendingMachineModel.validatePaymentConfirmation).to.have.been.called();
    expect(vendingService.vendingMachineModel.getValues().selectedProduct.amount).to.equal(9);

    vendingService.deposit(50, callback);
    expect(vendingService.vendingMachineModel.purchaseProduct).to.have.been.called.with(callback);
    expect(vendingService.vendingMachineModel.refundBalance).to.have.been.called.with(callback);
    expect(vendingService.vendingMachineModel.getValues().balance).to.equal(0);
  });

  it('should be able to refund extra money', () => {
    vendingService.deposit(50);
    expect(vendingService.vendingMachineModel.getValues().balance).to.be.equal(50);

    vendingService.makeSelection(1, callback);
    expect(vendingService.vendingMachineModel.purchaseProduct).to.have.been.called.with(callback);
    expect(vendingService.vendingMachineModel.refundBalance).to.have.been.called.with(callback);
  });

  it('should not refund money when exact amount is paid', () => {
    vendingService.deposit(50);
    expect(vendingService.vendingMachineModel.getValues().balance).to.be.equal(50);

    vendingService.makeSelection(2, callback);
    expect(vendingService.vendingMachineModel.purchaseProduct).to.have.been.called.with(callback);
    expect(vendingService.vendingMachineModel.refundBalance).to.have.been.called.with(callback);
  });
});
