import * as HVNToken from "../../smartContracts/build/contracts/HVNToken";

Contracts['HVNToken'] = web3.eth.contract(HVNToken.abi).at(Meteor.settings.public.contracts.HVN.address);
