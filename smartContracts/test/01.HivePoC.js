var Hive = artifacts.require("./HiveProjectPOC.sol");

contract('HiveProjectPOC', (accounts) => {
  let hive
  before(async function () {
    hive = await Hive.deployed()
  })

  describe("Companies", () => {
    it("have 2 companies", async () => {
      return hive.listCompanies()
        .then((count) => assert.equal(count.length, 2, " does not have 2 companies"));
    })

    it("create a company", async () => {
      return hive.createCompany(1, "name", "address1", "address2", "city", "postalCode", "vatNumber", "businessNumber", { from: accounts[0] })
        .then((company) => assert.notEqual(company, 0x0, "company not created"));
    })

    it("have 3 company", async () => {
      return hive.listCompanies()
        .then((count) => assert.equal(count.length, 3, "does not have 3 companies"));
    })
  })


  describe("Investors", () => {
    it("have 1 investors", async () => {
      return hive.listInvestors()
        .then((count) => assert.equal(count.length, 1, " does not have 1 investors"));
    })

    it("create an investor", async () => {
      return hive.createInvestors(1, "name", "address1", "address2", "city", "postalCode", { from: accounts[0] })
        .then((investor) => assert.notEqual(investor, 0x0, "investor not created"));
    })

    it("have 2 investor", async () => {
      return hive.listInvestors()
        .then((count) => assert.equal(count.length, 2, "does not have 2 investor"));
    })
  })

  describe("Invoices", () => {
    it("have 0 invoices", async () => {
      return hive.listInvoices()
        .then((count) => assert.equal(count.length, 0, " does not have 0 invoices"));
    })

    it("add an invoice", async () => {
      var invoice = "0x72ba7d8e73fe8eb666ea66babc8116a41bfb10e2";
      return hive.listInvoices().then((count) => assert.equal(count.length, 0, "does not have 0 invoices"))
        .then(() => hive.addInvoice(invoice))
        .then(() => hive.listInvoices()).then((count) => assert.equal(count.length, 1, "invoice not added"));
    })
  })
})
