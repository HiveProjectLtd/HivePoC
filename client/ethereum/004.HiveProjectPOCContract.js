import * as HiveProjectPOC from "../../smartContracts/build/contracts/HiveProjectPOC";

Contracts['HiveProjectPOC'] = web3.eth.contract(HiveProjectPOC.abi).at(Meteor.settings.public.contracts.HiveProjectPOC.address);
