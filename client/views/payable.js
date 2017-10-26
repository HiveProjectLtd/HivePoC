/**
Template Controllers
@module Templates
*/

/**
The dashboard template
@class [template] views_payable
@constructor
*/

Template['views_payable'].onCreated(function() {

    var template = this;

    this.hvnBalance = new ReactiveVar(0);
    Balances.find({ address: Meteor.settings.public.contracts.PayableCompany.owner }).observe({
        added: (e) => template.hvnBalance.set(e.balance),
        changed: (e) => template.hvnBalance.set(e.balance),
    })

    this.invoices = new ReactiveVar([]);
    Invoices.find({ state: { $ne: "2" } }).observe({
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

Template['views_payable'].helpers({
    invoices: () => Template.instance().invoices.get(),
    hvnBalance: () => Template.instance().hvnBalance.get(),
    awaitingPayments: () => _.reduce(Template.instance().invoices.get(), (result, i) => result += parseFloat(i.amount), 0).toFixed(2),
    investmentAccount: () => Meteor.settings.public.contracts.PayableCompany.address
})

Template['views_payable'].events({
    'click .confirm-invoice': (e, template) => _confirmInvoice(e.target.dataset.address),
    'click .pay-invoice': (e, template) => _payInvoice(e.target.dataset.address),
})

var _confirmInvoice = (invoiceAddress) => {
    // PoC: better UX when web3 request is not chained with minimongo request
    Contracts.InvoiceContract.at(invoiceAddress)
        .markAsConfirmed(Meteor.settings.public.contracts.PayableCompany.address, { from: Meteor.settings.public.contracts.PayableCompany.owner, gas: 4712388 })

    Invoices.update({ invoiceAddress: invoiceAddress }, {
        $set: {
            isConfirmed: true,
            waitingForBlockchain: 3
         }
    }, () => EthElements.Modal.hide())
}

var _payInvoice = (invoiceAddress) => {
    // PoC: better UX when web3 request is not chained with minimongo request
    Contracts.InvoiceContract.at(invoiceAddress)
        .buyInvoice(
            Meteor.settings.public.contracts.PayableCompany.address,
            { from: Meteor.settings.public.contracts.PayableCompany.owner, gas: 4712388 }
        )

    Invoices.update({ invoiceAddress: invoiceAddress }, {
        $set: {
            state: "2",
            owner: Meteor.settings.public.contracts.PayableCompany.address,
            waitingForBlockchain: 3
        }
    }, () => EthElements.Modal.hide())
}
