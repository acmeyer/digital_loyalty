var Account = require('../models/account');
var User = require('../models/user');

var accounts = {
  authorize: function(req, res, next) {
    // Authorize a current user trying to access an account's routes
    var current_user = req.user;
    var userBelongsToAccount = current_user.accounts.some(function (account) {
      return account.equals(req.params.account_id);
    });
    if (userBelongsToAccount) {
      next();
    } else {
      res.status(403);
      res.send({
        "status": 403,
        "message": "User does not have access to this account."
      })
    }
  },

  getAll: function(req, res) {
    // Find all accounts for current user
    var current_user = req.user;
    Account.where('_id').in(current_user.accounts).exec(function(err, accounts) {
      if (err) res.send(err);

      res.send(accounts);
    })
  },

  getOne: function(req, res) {
    // Return an account
    Account.findById(req.params.account_id, function(err, account) {
      if (err) res.send(err)
      
      res.send(account)
    })
  },

  create: function(req, res) {
    // Create an account for current user
    var current_user = req.user;
    var account_params = {
      name: req.body.account_name,
      creator: current_user.id,
      users: [current_user.id]
    }
    Account.create(account_params, function(err, account) {
      if (err) res.send(err)

      current_user.accounts.push(account);
      current_user.save(function(err) {if (err) res.send(err)});

      res.send(account)
    })
  },

  update: function(req, res) {
    // Update an account
    Account.findById(req.params.account_id, function(err, account) {
      if (err) res.send(err)

      if (req.body.account_name) account.name = req.body.account_name;
      if (req.body.users) account.users.push(req.body.users);
      
      account.save(function(err) {
        if (err) res.send(err);

        res.send(account);
      })
    })
  },

  delete: function(req, res) {
    // Delete an account
    var current_user = req.user;
    Account.findById(req.params.account_id, function(err, account) {
      if (err) res.send(err);

      if (account.creator.equals(current_user.id)) {
        // Remove the account and its reference in associated users
        User.where('_id').in(account.users).exec(function(err, users) {
          if (err) res.send(err);

          for(var i = 0; i < users.length; i++) {
            users[i].accounts.remove(account.id);
            users[i].save(function(err) {if (err) res.send(err)});
          }

          account.remove({
            _id: req.params.account_id
          }, function(err) {
            if (err) res.send(err);
            
            res.send({message: "Account removed!"})
          })
        })
      } else {
        res.status(403);
        res.send({
          "status": 403,
          "message": "The current user does not have permission to delete this account"
        })
      }
    })
  }
}

module.exports = accounts;