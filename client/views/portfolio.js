/**
Template Controllers
@module Templates
*/

/**
The dashboard template
@class [template] views_portfolio
@constructor
*/

Template['views_portfolio'].onCreated(function() {

    var template = this;

    this.hvnBalance = new ReactiveVar(0);
    Balances.find({ address: Meteor.settings.public.contracts.Investor.owner }).observe({
        added: (e) => template.hvnBalance.set(e.balance),
        changed: (e) => template.hvnBalance.set(e.balance),
    })

    this.invoices = new ReactiveVar([]);
    this.ownedInvoices = new ReactiveVar([]);
    this.onSaleInvoices = new ReactiveVar([]);
    this.closedInvoices = new ReactiveVar([]);
    Invoices.find().observe({
        added: (e) => {
            var invoices = lodash.remove(template.invoices.get(), (i) => i.invoiceId != e.invoiceId)
            invoices.push(e)
            template.invoices.set(invoices)

            template.ownedInvoices.set(lodash.filter(invoices, { state: "0", owner: Meteor.settings.public.contracts.Investor.address }))
            template.onSaleInvoices.set(lodash.filter(invoices, { state: "1", owner: Meteor.settings.public.contracts.Investor.address }))
            template.closedInvoices.set(lodash.filter(invoices, (i) => {
                return i.state == "2" && i.owners.indexOf(Meteor.settings.public.contracts.Investor.address) > 0
            }))
        },
        changed: (e) => {
            var invoices = lodash.remove(template.invoices.get(), (i) => i.invoiceId != e.invoiceId)
            invoices.push(e)
            template.invoices.set(invoices)

            template.ownedInvoices.set(lodash.filter(invoices, { state: "0", owner: Meteor.settings.public.contracts.Investor.address }))
            template.onSaleInvoices.set(lodash.filter(invoices, { state: "1", owner: Meteor.settings.public.contracts.Investor.address }))
            template.closedInvoices.set(lodash.filter(invoices, (i) => {
                return i.state == "2" && i.owners.indexOf(Meteor.settings.public.contracts.Investor.address) > 0
            }))
        }
    })
})

Template['views_portfolio'].helpers({
    ownedInvoices: () => Template.instance().ownedInvoices.get(),
    onSaleInvoices: () => Template.instance().onSaleInvoices.get(),
    closedInvoices: () => Template.instance().closedInvoices.get(),
    hvnBalance: () => Template.instance().hvnBalance.get(),
    investmentAccount: () => Meteor.settings.public.contracts.Investor.address,
    awaitingPayments: () => _.reduce(Template.instance().ownedInvoices.get(), (result, i) => result += parseFloat(i.amount), 0).toFixed(2),
    receivedPayments: () => _.reduce(Template.instance().closedInvoices.get(), (result, i) => result += parseFloat(i.amount), 0).toFixed(2),
})

Template['views_portfolio'].events({
    'click .resell-invoice': (e, template) => _resellInvoice(e, template),
    'click .cancel-invoice': (e, template) => _cancelInvoiceSell(e, template)
})

Template['views_modals_sell_invoice'].events({
    'submit .sell-invoice'(event) {
        event.preventDefault();
        const target = event.target;

        var expirationDate = target.expiration_date.value;
        var takeoverAmount = target.takeover_amount.value;
        var address = target.address.value;

        // PoC: better UX when web3 request is not chained with minimongo request
        Contracts.InvoiceContract.at(address)
            .markAsOnSale(
                Meteor.settings.public.contracts.Investor.address,
                moment(expirationDate, "MM-DD-YYYY").unix(),
                takeoverAmount,
                { from: Meteor.settings.public.contracts.Investor.owner, gas: 4712388 }
            )

        Invoices.update({ invoiceAddress: address }, {
            $set: {
                expirationDate: target.expiration_date.value,
                takeoverAmount: target.takeover_amount.value,
                state: "1",
                waitingForBlockchain: 3
            }
        }, () => EthElements.Modal.hide())
    },
    'click .cancel'(event) {
        EthElements.Modal.hide()
    }
})

var _resellInvoice = (e) => {
    EthElements.Modal.show({
        template: 'views_modals_sell_invoice',
        data: {
            address: e.target.dataset.address
        }
    })
}

var _cancelInvoiceSell = (e) => {
    // PoC: better UX when web3 request is not chained with minimongo request
    Contracts.InvoiceContract.at(e.target.dataset.address)
        .markAsPending(
            Meteor.settings.public.contracts.Investor.address,
            { from: Meteor.settings.public.contracts.Investor.owner, gas: 4712388 }
        ,console.log)

    Invoices.update({ invoiceAddress: e.target.dataset.address }, {
        $set: {
            state: "0",
            waitingForBlockchain: 3
        }
    }, () => EthElements.Modal.hide())
}
