import * as Invoice from "../../smartContracts/build/contracts/Invoice";

Contracts['InvoiceContract'] = web3.eth.contract(Invoice.abi)
