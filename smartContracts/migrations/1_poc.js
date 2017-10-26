var Hive = artifacts.require("./HiveProjectPOC.sol");
var Company = artifacts.require("./Company.sol");
var Investor = artifacts.require("./Investor.sol");
var Invoice = artifacts.require("./Invoice.sol");
var SafeMathLib = artifacts.require("./SafeMathLib.sol");

module.exports = function(deployer) {
    deployer.deploy(SafeMathLib);
    deployer.link(SafeMathLib, Hive);
    deployer.deploy(Hive, "0x63447af77faaab3059c0b5f42c955ce136d054d4");

};
