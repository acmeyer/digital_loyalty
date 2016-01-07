var express = require('express');
var jwt = require('jwt-simple');

var router = express.Router();
 
var auth = require('./controllers/auth')
var admin = require('./controllers/admin')
var assets = require('./controllers/assets')
var accounts = require('./controllers/accounts')
var transactions = require('./controllers/transactions')
var customers = require('./controllers/customers')
var users = require('./controllers/users')
 
/*
 * Public routes
 */
router.post('/login', auth.login);

/*
 * API V1 Routes
 */
/*
 * Customer Routes
 */
router.get('/api/v1/me', users.me);
router.post('/api/v1/me/asset/:asset_id/send', users.send);
 
/*
 * Merchant Routes
 */
// Account
router.get('/api/v1/accounts', accounts.getAll);
router.get('/api/v1/account/:account_id', accounts.authorize, accounts.getOne);
router.post('/api/v1/account/', accounts.create);
router.put('/api/v1/account/:account_id', accounts.authorize, accounts.update);
router.delete('/api/v1/account/:account_id', accounts.authorize, accounts.delete);

// Account's Assets
router.get('/api/v1/account/:account_id/assets', accounts.authorize, assets.getAll);
router.get('/api/v1/account/:account_id/asset/:id', accounts.authorize, assets.getOne);
router.post('/api/v1/account/:account_id/asset/', accounts.authorize, assets.create);
router.post('/api/v1/account/:account_id/asset/:id/send', accounts.authorize, assets.send);
router.put('/api/v1/account/:account_id/asset/:id', accounts.authorize, assets.update);

// Account's Transactions
router.get('/api/v1/account/:account_id/transactions', accounts.authorize, transactions.getAll);
router.get('/api/v1/account/:account_id/transaction/:id', accounts.authorize, transactions.getOne);

// Account's Customers
router.get('/api/v1/account/:account_id/customers', accounts.authorize, customers.getAll);
router.get('/api/v1/account/:account_id/customer/:id', accounts.authorize, customers.getOne);
router.put('/api/v1/account/:account_id/customer/:id', accounts.authorize, customers.update);
 
/*
 * Admin Routes
 */
// All Users
router.get('/api/v1/admin/users', admin.users.getAll);
router.get('/api/v1/admin/user/:id', admin.users.getOne);
router.post('/api/v1/admin/user/', admin.users.create);
router.put('/api/v1/admin/user/:id', admin.users.update);
router.delete('/api/v1/admin/user/:id', admin.users.delete);

// All Accounts
router.get('/api/v1/admin/accounts', admin.accounts.getAll);
router.get('/api/v1/admin/account/:id', admin.accounts.getOne);
router.post('/api/v1/admin/account/', admin.accounts.create);
router.put('/api/v1/admin/account/:id', admin.accounts.update);
router.delete('/api/v1/admin/account/:id', admin.accounts.delete);

// All Assets
router.get('/api/v1/admin/assets', admin.assets.getAll);
router.get('/api/v1/admin/asset/:id', admin.assets.getOne);
router.post('/api/v1/admin/asset/', admin.assets.create);
router.post('/api/v1/admin/asset/:id/send', admin.assets.send);
router.put('/api/v1/admin/asset/:id', admin.assets.update);
router.delete('/api/v1/admin/asset/:id', admin.assets.delete);

// All Transactions
router.get('/api/v1/admin/transactions', admin.transactions.getAll);
router.get('/api/v1/admin/transaction/:id', admin.transactions.getOne);
router.post('/api/v1/admin/transaction/', admin.transactions.create);
router.put('/api/v1/admin/transaction/:id', admin.transactions.update);
router.delete('/api/v1/admin/transaction/:id', admin.transactions.delete);

// All Customers
router.get('/api/v1/admin/customers', admin.customers.getAll);
router.get('/api/v1/admin/customer/:id', admin.customers.getOne);
 
module.exports = router;