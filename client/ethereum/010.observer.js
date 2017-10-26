var toUtf8 = web3.toUtf8
let _updateDb = () => {
    // Update HVN balance for each actor
    Balances.upsert({ address: Meteor.settings.public.contracts.Investor.owner }, {
        $set: {
            address: Meteor.settings.public.contracts.Investor.owner,
            balance: Contracts.HVNToken.balanceOf(Meteor.settings.public.contracts.Investor.owner).valueOf()
        }
    })

    Balances.upsert({ address: Meteor.settings.public.contracts.ReceivableCompany.owner }, {
        $set: {
            address: Meteor.settings.public.contracts.ReceivableCompany.owner,
            balance: Contracts.HVNToken.balanceOf(Meteor.settings.public.contracts.ReceivableCompany.owner).valueOf()
        }
    })

    Balances.upsert({ address: Meteor.settings.public.contracts.PayableCompany.owner }, {
        $set: {
            address: Meteor.settings.public.contracts.PayableCompany.owner,
            balance: Contracts.HVNToken.balanceOf(Meteor.settings.public.contracts.PayableCompany.owner).valueOf()
        }
    })

    // Get all invoices, iterate them and update minimongo with latest data
    Contracts.HiveProjectPOC.listInvoices((e,r) => {
        if(!r) return;

        r.forEach((invoiceAddress) => {
            invoice = Contracts.InvoiceContract.at(invoiceAddress)
            var dbInvoice = Invoices.findOne({ invoiceId: invoice.getInvoiceId().valueOf() })
            if(dbInvoice) {
                // poc: workaround for showing the spinner until a particular change was confirmed by the network
                // real world: when a change occur watch the transaction that does it being confirmed
                if(dbInvoice.waitingForBlockchain > 0) {
                    Invoices.update({ invoiceId: dbInvoice.invoiceId }, {
                        $set: {
                            waitingForBlockchain: dbInvoice.waitingForBlockchain - 1
                        }
                    })
                } else {
                    Invoices.update({ invoiceId: dbInvoice.invoiceId }, {
                        $set: {
                            expirationDate: moment.unix(invoice.getOfferExpiresDate().valueOf()).format('MM-DD-YYYY'),
                            owner: invoice.getOwner().valueOf(),
                            takeoverAmount: invoice.getTakeOverPrice().valueOf(),
                            customer: invoice.getCustomer().valueOf(),
                            isConfirmed: invoice.isConfirmed().valueOf(),
                            owners: invoice.listOwners(),
                            waitingForBlockchain: 0
                        }
                    })
                }
            } else {
                Invoices.insert({
                    invoiceAddress: invoiceAddress,
                    issueDate: moment.unix(invoice.getIssueDate().valueOf()).format('MM-DD-YYYY'),
                    dueDate: moment.unix(invoice.getDueDate().valueOf()).format('MM-DD-YYYY'),
                    expirationDate: moment.unix(invoice.getOfferExpiresDate().valueOf()).format('MM-DD-YYYY'),
                    invoiceId: invoice.getInvoiceId().valueOf(),
                    amount: invoice.getAmount().valueOf(),
                    takeoverAmount: invoice.getTakeOverPrice().valueOf(),
                    owner: invoice.getOwner().valueOf(),
                    currency: toUtf8(invoice.getCurrency().valueOf()),
                    country: toUtf8(invoice.getCountry().valueOf()),
                    maxDiscount: invoice.getMaxDiscount().valueOf(),
                    customer: invoice.getCustomer().valueOf(),
                    state: invoice.getState().valueOf(),
                    isConfirmed: invoice.isConfirmed().valueOf(),
                    owners: invoice.listOwners(),
                    waitingForBlockchain: 0
                })
            }
        })
    })
}

// Filters polling take a lot of resources, interval suits PoC needs
var interval = setInterval(_updateDb, 5000)
_updateDb()
