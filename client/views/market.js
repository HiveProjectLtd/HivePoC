/**
Template Controllers
@module Templates
*/

/**
The dashboard template
@class [template] views_market
@constructor
*/

Template['views_market'].onCreated(function() {

    var template = this;

    this.hvnBalance = new ReactiveVar(0);
    Balances.find({ address: Meteor.settings.public.contracts.Investor.owner }).observe({
        added: (e) => template.hvnBalance.set(e.balance),
        changed: (e) => template.hvnBalance.set(e.balance),
    })

    this.invoices = new ReactiveVar([]);
    Invoices.find({ state: "1" }).observe({
        added: (e) => {
            var invoices = lodash.remove(template.invoices.get(), (i) => i.invoiceId != e.invoiceId)
            invoices.push(e)
            template.invoices.set(invoices)
        },
        changed: (e) => {
            var invoices = lodash.remove(template.invoices.get(), (i) => i.invoiceId != e.invoiceId)
            invoices.push(e)
            template.invoices.set(invoices)
        }
    })
})

Template['views_market'].helpers({
    invoices: () => Template.instance().invoices.get(),
    hvnBalance: () => Template.instance().hvnBalance.get(),
    investmentAccount: () => Meteor.settings.public.contracts.Investor.address
})

Template['views_market'].events({
    'click .buy-invoice': (e, template) => _buyInvoice(e.target.dataset.address)
})

var _buyInvoice = (invoiceAddress) => {
    // PoC: better UX when web3 request is not chained with minimongo request
    Contracts.InvoiceContract.at(invoiceAddress)
        .buyInvoice(
            Meteor.settings.public.contracts.Investor.address,
            { from: Meteor.settings.public.contracts.Investor.owner, gas: 4712388 }
        )

    Invoices.update({ invoiceAddress: invoiceAddress }, {
        $set: {
            state: "0",
            owner: Meteor.settings.public.contracts.Investor.address,
            waitingForBlockchain: 3
        }
    }, () => EthElements.Modal.hide())
}
