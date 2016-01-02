var express = require('express');
var jwt = require('jwt-simple');

var router = express.Router();
 
var auth = require('./auth')
var admin = require('./admin')
var assets = require('./assets')
var accounts = require('./accounts')
var transactions = require('./transactions')
var customers = require('./customers')
var users = require('./users')
 
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
router.get('/api/v1/account/:account_id', accounts.getOne);
router.post('/api/v1/account/', accounts.create);
router.put('/api/v1/account/:account_id', accounts.update);
router.delete('/api/v1/account/:account_id', accounts.delete);

// Account's Assets
router.get('/api/v1/account/:account_id/assets', assets.getAll);
router.get('/api/v1/account/:account_id/asset/:id', assets.getOne);
router.post('/api/v1/account/:account_id/asset/', assets.create);
router.post('/api/v1/account/:account_id/asset/:id/send', assets.send);
router.put('/api/v1/account/:account_id/asset/:id', assets.update);
router.delete('/api/v1/account/:account_id/asset/:id', assets.delete);

// Account's Transactions
router.get('/api/v1/account/:account_id/transactions', transactions.getAll);
router.get('/api/v1/account/:account_id/transaction/:id', transactions.getOne);
router.post('/api/v1/account/:account_id/transaction/', transactions.create);
router.put('/api/v1/account/:account_id/transaction/:id', transactions.update);

// Account's Customers
router.get('/api/v1/account/:account_id/customers', customers.getAll);
router.get('/api/v1/account/:account_id/customer/:id', customers.getOne);
router.post('/api/v1/account/:account_id/customer/', customers.create);
router.put('/api/v1/account/:account_id/customer/:id', customers.update);
 
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
 
module.exports = router;