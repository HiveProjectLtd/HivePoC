Contracts = {}
if(typeof web3 === 'undefined') {
    web3 = new Web3(new Web3.providers.HttpProvider(Meteor.settings.public.geth.address));
    web3.personal.unlockAccount("0x592bd287d4e8849d15d3305b2a95c0bd077c2114", "", 150000, () => {});
    web3.personal.unlockAccount("0x9d4f185f64d2a05630e3f8ebd873f12500d611da", "", 150000, () => {});
    web3.personal.unlockAccount("0x915eed615cb83757666f8128d75498d0072db943", "", 150000, () => {});
    web3.personal.unlockAccount("0x67815743a94ce8eb65ade04e4b1b88306012a8f4", "", 150000, () => {});
}
