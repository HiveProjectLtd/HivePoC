import * as Investor from "../../smartContracts/build/contracts/Investor";

Contracts['InvestorContract'] = web3.eth.contract(Investor.abi).at(Meteor.settings.public.contracts.Investor.address);
