var Account = require('../models/account');

var customers = {
  getAll: function(req, res) {
    findAccount(req.params.account_id, function(err, account) {
      if (err) {
        res.status(422)
        res.send(err)
      }

      res.send(account.customers)
    })
  },

  getOne: function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if (err) {
        res.status(422)
        res.send(err)
      }

      res.send(user)
    })
  },

  update: function(req, res) {
    var user_params = {
      phone_number: req.body.phone_number
    }

    User.findById(req.params.id, function(err, user) {
      if (err) {
        res.status(422)
        res.send(err)
      }

      user.update(user_params, function(err, user) {
        if (err) {
          res.status(422)
          res.send(err)
        }

        res.send(user)
      })
    })
  }
}

function findAccount (account_id, cb) {
  Account.findById(account_id, function(err, account) {
    if (err) return cb(err);
    
    return cb(null, account);
  })
}

module.exports = customers;