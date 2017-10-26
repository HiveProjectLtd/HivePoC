import * as Company from "../../smartContracts/build/contracts/Company";

Contracts['ReceivableCompanyContract'] = web3.eth.contract(Company.abi).at(Meteor.settings.public.contracts.ReceivableCompany.address);
Contracts['PayableCompanyContract'] = web3.eth.contract(Company.abi).at(Meteor.settings.public.contracts.PayableCompany.address);
