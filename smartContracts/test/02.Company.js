var Hive = artifacts.require("./HiveProjectPOC.sol");
var Company = artifacts.require("./Company.sol");

contract('Company', (accounts) => {
    var hive;
    var company;
    var customerAddress = "0x72ba7d8e73fe8eb666ea66babc8116a41bfb10e1";
    var invoiceAddress = "0x72ba7d8e73fe8eb666ea66babc8116a41bfb10e2";

    before(async function () {
        hive = await Hive.deployed();
        var companies = await hive.listCompanies();
        company = Company.at(companies[0]);
        var owners = await company.listOwners();
    })

    describe("Owners", () => {
        it("have 1 owner", async () => {
        return company.listOwners()
            .then((count) => assert.equal(count.length, 1, "does not have 1 owner"));
        })

        it("is owner", async () => {
            return company.isOwner(accounts[1])
            .then((result) => assert.equal(result, true, "is not an owner"));
        })

        it("add owner", async () => {
            return company.listOwners().then((count) => assert.equal(count.length, 1, "does not have 1 owner"))
            .then(() => company.isOwner(accounts[2])).then((result) => assert.equal(result, false, "is owner"))
            .then(() => company.addOwner(accounts[2], { from: accounts[1] }))
            .then(() => company.isOwner(accounts[2])).then((result) => assert.equal(result, true, "owner not added"))
            .then(() => company.listOwners()).then((count) => assert.equal(count.length, 2, "does not have 2 owners"));
        })

        it("remove owner", async () => {
            return company.listOwners().then((count) => assert.equal(count.length, 2, "does not have 2 owners"))
            .then(() => company.isOwner(accounts[2])).then((result) => assert.equal(result, true, "is not owner"))
            .then(() => company.revokeOwner(accounts[2], { from: accounts[1] }))
            .then(() => company.isOwner(accounts[2])).then((result) => assert.equal(result, false, "owner not removed"))
            .then(() => company.listOwners()).then((count) => assert.equal(count.length, 1, "does not have 1 owner"));
        })
    })

    describe("Invoices", () => {
        describe("Create", () => {
            it("create invoice", async () => {
                return hive.listInvoices().then((list) => assert.equal(list.length, 0, "hive does not have 0 invoices"))
                .then(() => company.createInvoice(1, 2, customerAddress, 1, 100, "EUR", 10, {from: accounts[1]})).then((invoice) => assert.notEqual(invoice.valueOf(), 0x0, "has not created invoice"))
                .then(() => hive.listInvoices()).then((list) => assert.equal(list.length, 1, "hive does not have 1 invoices"));
            })
        })
    })
})
