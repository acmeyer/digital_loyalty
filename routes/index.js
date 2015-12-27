var express = require('express');
var router = express.Router();
 
var auth = require('./auth.js');
var assets = require('./assets')
var accounts = require('./accounts')
var customers = require('./customers')
var transactions = require('./transactions')
var users = require('./users')
 
/*
 * Routes that can be accessed by anyone
 */
router.post('/login', auth.login);
 
/*
 * Routes that can be accessed only by autheticated users
 */
// Assets
router.get('/api/v1/assets', assets.getAll);
router.get('/api/v1/asset/:id', assets.getOne);
router.post('/api/v1/asset/', assets.create);
router.post('/api/v1/asset/:id/send', assets.send);
router.put('/api/v1/asset/:id', assets.update);
router.delete('/api/v1/asset/:id', assets.delete);

// Customers
router.get('/api/v1/customers', customers.getAll);
router.get('/api/v1/customer/:id', customers.getOne);
router.post('/api/v1/customer/', customers.create);
router.put('/api/v1/customer/:id', customers.update);
router.delete('/api/v1/customer/:id', customers.delete);

// Transactions
router.get('/api/v1/transactions', transactions.getAll);
router.get('/api/v1/transaction/:id', transactions.getOne);
router.post('/api/v1/transaction/', transactions.create);
router.put('/api/v1/transaction/:id', transactions.update);
router.delete('/api/v1/transaction/:id', transactions.delete);
 
/*
 * Routes that can be accessed only by authenticated & authorized users
 */
// Users
router.get('/api/v1/admin/users', users.getAll);
router.get('/api/v1/admin/user/:id', users.getOne);
router.post('/api/v1/admin/user/', users.create);
router.put('/api/v1/admin/user/:id', users.update);
router.delete('/api/v1/admin/user/:id', users.delete);

// Accounts
router.get('/api/v1/admin/accounts', accounts.getAll);
router.get('/api/v1/admin/account/:id', accounts.getOne);
router.post('/api/v1/admin/account/', accounts.create);
router.put('/api/v1/admin/account/:id', accounts.update);
router.delete('/api/v1/admin/account/:id', accounts.delete);
 
module.exports = router;