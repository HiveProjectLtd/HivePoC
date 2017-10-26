var Hive = artifacts.require("./HiveProjectPOC.sol");
var Company = artifacts.require("./Company.sol");
var Investor = artifacts.require("./Investor.sol");
var Invoice = artifacts.require("./Invoice.sol");


var createEntities = function(hive) {
    hive.createCompany(1, "seller", "address11", "address12", "city1", "postalCode1", "vatNumber1", "businessNumber1", { from: web3.eth.accounts[1] });
    hive.createCompany(1, "payer", "address22", "address22", "city2", "postalCode2", "vatNumber2", "businessNumber2", { from: web3.eth.accounts[2] });
    hive.createInvestors(1, "investor", "address31", "address32", "city3", "postalCode3", { from: web3.eth.accounts[3] });
}
module.exports = function(deployer) {
    Hive.deployed().then(createEntities);
};
