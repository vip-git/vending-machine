// Library
import * as mocha from 'mocha';
import * as chai from 'chai';
import * as chaiSpies from 'chai-spies';

// Service
import { VendingMachineService } from '../vending-machine.service';
import { ProductsMockData } from '../product-data.mock';

// testing inits
chai.use(chaiSpies);
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();

describe('Vending Service Specs', () => {
  let vendingService: any;

  beforeEach(() => {
    vendingService = new VendingMachineService();
    chai.spy.on(vendingService, 'purchaseProduct');
    chai.spy.on(vendingService, 'validatePaymentConfirmation');
    chai.spy.on(vendingService, 'refundBalance');
  });

  it('should be able to check initial state', () => {
    // // check initial state
    expect(vendingService.vendingMachine.balance).to.equal(0);
    expect(vendingService.vendingMachine.selectedProduct).to.equal(null);
    expect(vendingService.products).to.equal(ProductsMockData);
    expect(vendingService.getProduct(1)).to.equal(ProductsMockData[0]);
  });

  it('should be able to deposit money', () => {
    vendingService.deposit(25);
    expect(vendingService.vendingMachine.balance).to.equal(25);
  });

  it('should be able to make selection', () => {
    // buy a coke with exact change
    vendingService.deposit(50);

    expect(vendingService.getProduct(1).amount).to.equal(10);
    expect(vendingService.vendingMachine.balance).to.equal(50);

    expect(vendingService.makeSelection(123424)).to.equal('invalid');

    vendingService.makeSelection(1);
    expect(vendingService.getProduct(1).amount).to.equal(9);
    expect(vendingService.purchaseProduct).to.have.been.called();
  });

  it('should be able to deposit after selection is done', () => {
    vendingService.deposit(20);
    expect(vendingService.getProduct(1).amount).to.equal(9);
    expect(vendingService.vendingMachine.balance).to.equal(20);
    expect(vendingService.vendingMachine.selectedProduct).to.equal(null);

    // make a selection first, put in extra money
    vendingService.makeSelection(1);
    expect(vendingService.validatePaymentConfirmation).to.have.been.called();
    expect(vendingService.vendingMachine.selectedProduct.amount).to.equal(9);

    vendingService.deposit(35);
    expect(vendingService.purchaseProduct).to.have.been.called();
    expect(vendingService.refundBalance).to.have.been.called();
    expect(vendingService.vendingMachine.balance).to.equal(0);
  });

  it('should be able to refund extra money', () => {
    vendingService.deposit(100);
    expect(vendingService.vendingMachine.balance).to.be.equal(100);

    vendingService.makeSelection(1);
    expect(vendingService.purchaseProduct).to.have.been.called();
    expect(vendingService.refundBalance).to.have.been.called();
  });
});
