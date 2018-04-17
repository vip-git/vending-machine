import { VendingMachineCMDView } from './view/vending-machine.cmd.view';

export default class VendingMachineApp {

    constructor(blockChainCreds: any = false) {
        return new VendingMachineCMDView(blockChainCreds);
    }
}
