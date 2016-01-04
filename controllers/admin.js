var User = require('../models/user');
var Account = require('../models/account');
var Transaction = require('../models/transaction');
var Asset = require('../models/asset');

var admin = {

  // Users
  users: {
    getAll: function(req, res) {
      User.find(function(err, users) {
        if (err) res.send(err);
        
        res.send(users);
      })
    },

    getOne: function(req, res) {
      User.findById(req.params.id, function(err, user) {
        if (err) res.send(err)
        
        res.send(user)
      })
    },

    create: function(req, res) {
      user_params = {
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
      }
      User.create(user_params, function(err, user) {
        if (err) res.send(err)

        res.send(user)
      })
    },

    update: function(req, res) {
      res.send();
    },

    delete: function(req, res) {
      User.remove({
        _id: req.params.user_id
      }, function(err, user) {
        if (err) res.send(err);
        
        res.json({message: "User removed!"})
      })
    }
  },

  // Accounts
  accounts: {
    getAll: function(req, res) {
      Account.find(function(err, accounts) {
        if (err) res.send(err);
        
        res.send(accounts)
      })
    },

    getOne: function(req, res) {
      Account.findById(req.params.id, function(err, account) {
        if (err) res.send(err)
        
        res.send(account)
      })
    },

    create: function(req, res) {
      var account_params = {
        name: req.body.account_name,
        creator: req.body.creator_id,
        users: req.body.users
      }
      Account.create(account_params, function(err, account) {
        if (err) res.send(err)

        User.where('_id').in(account.users).exec(function(err, users) {
          if (err) res.send(err);

          for(var i = 0; i < users.length; i++) {
            users[i].accounts.push(account.id);
            users[i].save(function(err) {if (err) res.send(err)});
          }
          res.send(account)
        })
      })
    },

    update: function(req, res) {
      res.send();
    },

    delete: function(req, res) {
      Account.findById(req.params.account_id, function(err, account) {
        if (err) res.send(err);

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
      })
    }
  },

  // Transactions
  transactions: {
    getAll: function(req, res) {
      res.send();
    },

    getOne: function(req, res) {
      res.send();
    },

    create: function(req, res) {
      res.send();
    },

    update: function(req, res) {
      res.send();
    },

    delete: function(req, res) {
      res.send();
    }
  },

  // Assets
  assets: {
    /* GET all assets */
    getAll: function(req, res) {
      Asset.find(function(err, assets) {
        if (err) res.send(err);
          
        // Get asset information from the blockchain
        blockchainAssets = [];
        assets.each(function(index, asset) {
          colu.coloredCoins.getAssetData({assetId: asset.id}, function(err, body) {
            if (err) res.send(err);
            blockchainAssets.push(JSON.stringify(body));
          })
        });
        res.json(blockchainAssets);
      })
    },

    /* GET asset */
    getOne: function(req, res) {
      Asset.findById(req.params.id, function(err, asset) {
        if (err) res.send(err)

        // Get data from blockchain
        colu.coloredCoins.getAssetData({assetId: asset.id}, function(err, body) {
          if (err) res.send(err);
          res.json(JSON.stringify(body));
        })
      })
    },

    /* CREATE asset */
    create: function(req, res) {
      var assetName = req.body.assetName
      var amount = req.body.amount

      // Need to be more flexible here to accept potentially lots of different information but also make sure not anything can be sent
      var settings = {
        metadata: {
         'assetName': assetName
        },
        'amount': amount
      }

      colu.issueAsset(settings, function (err, result) {
        if (err) return res.send(err)

        // Need to save more info about the asset here
        var asset = new Asset({
          assetId: result.assetId
        });

        asset.save(function(err) {
          if (err) {
            res.send(err);
          } else {
            res.status(200);
            res.json({message: 'Created asset!'});
          }
        })
      })
    },

    /* SEND asset */
    send: function(req, res) {
      Asset.findById(req.params.id, function(err, asset) {
        if (err) res.send(err);

        var assetId = asset.assetId
        var toAddress = req.body.toAddress
        var fromAddress = asset.issueAdress
        var amount = req.body.amount

        var settings = {
          'from': fromAddress,
          'to': [{
            'address': address,
            'assetId': assetId,
            'amount': amount
          }]
        }
        colu.sendAsset(settings, function (err, result) {
          if (err) return next(err)
          // Also want to save transaction information here
          res.json({ message: "Asset sent!"})
        })
      })
    },

    /* UPDATE asset */
    update: function(req, res) {
      Asset.findById(req.params.id, function(err, asset) {
        if (err) res.send(err);

        // Update many different fields potentially here
        asset.save(function(err) {
          if (err) res.send(err);
          
          // Can we also update info of the asset on the blockchain?
          res.json({ message: "Asset updated!"});
        })
      })
    },

    /* DELETE asset */
    delete: function(req, res) {
      Asset.remove({
        _id: req.params.asset_id
      }, function(err, asset) {
        if (err) res.send(err);
        
        // Remove from the blockchain?
        res.json({message: "Asset removed!"})
      })
    }
  }
}

module.exports = admin;