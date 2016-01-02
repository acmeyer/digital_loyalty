var express = require('express');
var router = express.Router();

var Account = require('../models/account');

var accounts = {
  getAll: function(req, res) {
    // Find all accounts for current user
    // TODO: Need to figure this one out!!!
    // var current_user = req.user;
    // Account.find().where, function(err, accounts) {
    //   if (err) res.send(err);

    //   res.send(accounts);
    // })
  },

  getOne: function(req, res) {
    // Find an account for current user
    var current_user = req.user;
    if (req.params.account_id) {
      var userBelongsToAccount = current_user.accounts.some(function (account) {
        return account.equals(req.params.account_id);
      });
    } else {
      res.status(422);
      res.send({
        "status": 422,
        "message": "Account id missing"
      })
    }
    if (userBelongsToAccount) {
      Account.findById(req.params.account_id, function(err, account) {
        if (err) res.send(err)
        
        res.send(account)
      })
    } else {
      res.status(403);
      res.send({
        "status": 403,
        "message": "The current user does not have permission to see this account"
      })
    }
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
    // Update an account for current user
    var current_user = req.user;
    if (req.params.account_id) {
      var userBelongsToAccount = current_user.accounts.some(function (account) {
        return account.equals(req.params.account_id);
      });
    } else {
      res.status(422);
      res.send({
        "status": 422,
        "message": "Account id missing"
      })
    }
    if (userBelongsToAccount) {
      Account.findById(req.params.account_id, function(err, account) {
        if (err) res.send(err)

        if (req.body.account_name) account.name = req.body.account_name;
        if (req.body.users) account.users.push(req.body.users);
        
        account.save(function(err) {
          if (err) res.send(err);

          res.send(account);
        })
      })
    } else {
      res.status(403);
      res.send({
        "status": 403,
        "message": "The current user does not have permission to update this account"
      })
    }
  },

  delete: function(req, res) {
    // Delete an account for current user if they have permission to do so
    var current_user = req.user;
    if (req.params.account_id) {
      var userBelongsToAccount = current_user.accounts.some(function (account) {
        return account.equals(req.params.account_id);
      });
    } else {
      res.status(422);
      res.send({
        "status": 422,
        "message": "Account id missing"
      })
    }
    Account.findById(req.params.account_id, function(err, account) {
      if (err) res.send(err);

      if (userBelongsToAccount && account.creator.equals(current_user.id)) {
        account.remove({
          _id: req.params.account_id
        }, function(err, account) {
          if (err) res.send(err);
          
          res.json({message: "Account removed!"})
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