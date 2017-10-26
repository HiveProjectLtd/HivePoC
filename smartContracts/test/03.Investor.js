var Hive = artifacts.require("./HiveProjectPOC.sol");
var Investor = artifacts.require("./Investor.sol");

contract('Investor', (accounts) => {
    var hive;
    var investor, investorAddress;
    var invoiceAddress = "0x72ba7d8e73fe8eb666ea66babc8116a41bfb10e2";

    before(async function () {
        hive = await Hive.deployed();
        var investors = await hive.listInvestors();
        investor = Investor.at(investors[0]);
        var owners = await investor.listOwners();
    })

    describe("Owners", () => {
        it("have 1 owner", async () => {
        return investor.listOwners()
            .then((count) => assert.equal(count.length, 1, "does not have 1 owner"));
        })

        it("is owner", async () => {
            return investor.isOwner(accounts[3])
            .then((result) => assert.equal(result, true, "is not an owner"));
        })

        it("add owner", async () => {
            return investor.listOwners().then((count) => assert.equal(count.length, 1, "does not have 1 owner"))
            .then(() => investor.isOwner(accounts[2])).then((result) => assert.equal(result, false, "is owner"))
            .then(() => investor.addOwner(accounts[2], { from: accounts[3] }))
            .then(() => investor.isOwner(accounts[2])).then((result) => assert.equal(result, true, "owner not added"))
            .then(() => investor.listOwners()).then((count) => assert.equal(count.length, 2, "does not have 2 owners"));
        })

        it("remove owner", async () => {
            return investor.listOwners().then((count) => assert.equal(count.length, 2, "does not have 2 owners"))
            .then(() => investor.isOwner(accounts[2])).then((result) => assert.equal(result, true, "is not owner"))
            .then(() => investor.revokeOwner(accounts[2], { from: accounts[3] }))
            .then(() => investor.isOwner(accounts[2])).then((result) => assert.equal(result, false, "owner not removed"))
            .then(() => investor.listOwners()).then((count) => assert.equal(count.length, 1, "does not have 1 owner"));
        })
    })
})
