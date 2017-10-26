localforage.clear();

Balances = new Mongo.Collection('balances', {connection: null});
new PersistentMinimongo2(Balances, 'hivepoc');

Invoices = new Mongo.Collection('invoices', {connection: null});
new PersistentMinimongo2(Invoices, 'hivepoc');
