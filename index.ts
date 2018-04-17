// Library
import * as Web3 from 'web3';
import * as fs from 'fs';
import * as solc from 'solc';

// Application
import VendingMachineApp from './src/app';
import { ProductsMockData } from './src/mocks/product-data.mock';

let enableBlockChain = false;

process.argv.forEach((val, index) => {
    if (val.indexOf('--blockchain') !== -1) {
        enableBlockChain = true;
    }
});


if (enableBlockChain) {
    let web3: any = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    let code = fs.readFileSync('src/contracts/VendingMachine.sol').toString();
    let compiledCode = solc.compile(code);
    let abiDefinition = JSON.parse(compiledCode.contracts[':VendingMachine'].interface);
    let VendingMachineContract = web3.eth.contract(abiDefinition);
    let byteCode = compiledCode.contracts[':VendingMachine'].bytecode;
    let deployedContract = VendingMachineContract.new(ProductsMockData, {data: byteCode, from: web3.eth.accounts[0], gas: 4700000},
    function() {
        if (deployedContract.address) {
            const blockChainCreds = {
                web3: web3,
                contractInstance: VendingMachineContract.at(deployedContract.address)
            };
            new VendingMachineApp(blockChainCreds);
        }
    });
} else {
    new VendingMachineApp(enableBlockChain);
}


