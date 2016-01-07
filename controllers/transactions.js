var Transaction = require('../models/transaction');
var Account = require('../models/account');

var transactions = {
  getAll: function(req, res) {
    findAccount(req.params.account_id, function(err, account) {
      if (err) {
        res.status(422)
        res.send(err)
      }

      res.send(account.transactions)
    })
  },

  getOne: function(req, res) {
    Transaction.findById(req.params.id, function(err, transaction) {
      if (err) {
        res.status(422)
        res.send(err)
      }

      res.send(transaction)
    })
  }
}

function findAccount (account_id, cb) {
  Account.findById(account_id, function(err, account) {
    if (err) return cb(err);
    
    return cb(null, account);
  })
}

module.exports = transactions;