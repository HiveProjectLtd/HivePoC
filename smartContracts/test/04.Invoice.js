var Hive = artifacts.require("./HiveProjectPOC.sol");
var Company = artifacts.require("./Company.sol");
var Investor = artifacts.require("./Investor.sol");
var Invoice = artifacts.require("./Invoice.sol");

contract('Invoice', (accounts) => {
    var hive;
    var seller, sellerAddress
    var payer, payerAddress;
    var investor, investorAddress;
    var invoice, invoiceAddress;

    before(async function () {
        hive = await Hive.deployed();

        var companies = await hive.listCompanies();
        
        seller = Company.at(companies[0]);
        payer = Company.at(companies[1]);

        var investors = await hive.listInvestors();
        investor = Investor.at(investors[0]);

        invoiceAddress = await seller.createInvoice(1, 2, payer.address, 1, 100, "EUR", 10, { from: accounts[1] });
        var invoices = await hive.listInvoices();
        invoice = Invoice.at(invoices[0]);
    })

    describe("Confirmation", () => {
        it("is not confirmed", async () => {
            return invoice.isConfirmed().then((state) => assert.equal(state, false, "is confirmed"));
        })

        it("mark as confirmed", async () => {
            return invoice.markAsConfirmed(payer.address, { from: accounts[2] })
                .then(() => invoice.isConfirmed())
                .then((state) => assert.equal(state, true, "is not set as confirmed"));
        })
    })

    describe("State", () => {
        it("get state", async () => {
            return invoice.getState().then((state) => assert.equal(state.valueOf(), 0, "is not in pending state"));
        })

        it("mark as on sale", async () => {
            return invoice.markAsOnSale(seller.address, 234, 321, { from: accounts[1] })
                .then(() => invoice.getState()).then((state) => assert.equal(state.valueOf(), 1, "is not in on sale state"))
                .then(() => invoice.getTakeOverPrice()).then((price) => assert.equal(price.valueOf(), 321, "take over price not set"))
                .then(() => invoice.getOfferExpiresDate()).then((date) => assert.equal(date.valueOf(), 234, "offer expires date not set"));
        })

        it("mark as pending", async () => {
            return invoice.markAsPending(seller.address, { from: accounts[1] })
                .then(() => invoice.getState())
                .then((state) => assert.equal(state.valueOf(), 0, "is not in pending state"));
        })
    })
    
    describe("Owners", () => {
        it("get owner", async () => {
            return invoice.getOwner()
                .then((owner) => assert.equal(owner.valueOf(), seller.address, "it is not the correct owner"));
        })
        
        it("list owners", async () => {
            return invoice.listOwners()
                .then((count) => assert.equal(count.length, 1, "does not have 1 owner"));
        })

        it("change owner", async () => {
            return invoice.listOwners().then((count) => assert.equal(count.length, 1, "does not have 1 owner"))
                .then(() => invoice.changeOwner(seller.address, payer.address, { from: accounts[3] }))
                .then(() => invoice.listOwners()).then((count) => assert.equal(count.length, 2, "does not have 2 owners"))
                .then(() => invoice.changeOwner(payer.address, seller.address, { from: accounts[1] }))
                .then(() => invoice.listOwners()).then((count) => assert.equal(count.length, 3, "does not have 3 owners"))
        })
    })

    describe("set invoice data", () => {
        it("take over amount", () => {
            return invoice.setTakeOverPrice(seller.address, 10, { from: accounts[1] })
                .then(() => invoice.getTakeOverPrice())
                .then((takeOverAmount) => assert.equal(takeOverAmount.valueOf(), 10, "take over amount not set to 10"));
        })
    })
    
    describe("Buy invoice", () => {
        it("buy from investor", async () => {
            return invoice.buyInvoice(investor.address, { from: accounts[3] })
                .then(() => invoice.getOwner().then((owner) => assert.equal(owner, investor.address, "owner not changed"))
                .then(() => invoice.listOwners()).then((count) => assert.equal(count.length, 4, "does not have 4 owners")));
        })

        it("get history takeOverAmount", async () => {
            return invoice.getTakeOverPriceHistory(seller.address)
                .then((amount) => assert.equal(amount.valueOf(), 10, "settlement amount not correct"));
        })

        it("get history payedOnDate", async () => {
            return invoice.getPayedOnDateHistory(seller.address)
                .then((payedOnDate) => assert.notEqual(payedOnDate.valueOf(), 0, "payed On Date not correct"));
        })

        it("get history cost", async () => {
            return invoice.getCostHistory(seller.address)
                .then((amount) => assert.equal(amount.valueOf(), 10, "cost amount not correct"));
        })

        it("buy from payer", async () => {
            return invoice.buyInvoice(payer.address, { from: accounts[2] })
                .then(() => invoice.getOwner().then((owner) => assert.equal(owner, payer.address, "owner not changed"))
                .then(() => invoice.listOwners()).then((count) => assert.equal(count.length, 5, "does not have 5 owners"))
                .then(() => invoice.getState()).then((state) => assert.equal(state.valueOf(), 2, "has not been marked as settled")));
        })
    })
})
