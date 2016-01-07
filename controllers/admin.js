var User = require('../models/user');
var Account = require('../models/account');
var Transaction = require('../models/transaction');
var Asset = require('../models/asset');

var admin = {

  // Users
  users: {
    getAll: function(req, res) {
      User.find(function(err, users) {
        if (err) {
          res.status(422)
          res.send(err)
        }
        
        res.send(users);
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

    create: function(req, res) {
      user_params = {
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
      }
      User.create(user_params, function(err, user) {
        if (err) {
          res.status(422)
          res.send(err)
        }

        res.send(user)
      })
    },

    update: function(req, res) {
      User.findById(req.params.id, function(err, user) {
        if (err) {
          res.status(422)
          res.send(err)
        }
        user.update(req.body.user, function(err, user) {
          if (err) {
            res.status(422)
            res.send(err)
          }

          res.send(user)
        })
      })
    },

    delete: function(req, res) {
      User.remove({
        _id: req.params.user_id
      }, function(err, user) {
        if (err) {
          res.status(422)
          res.send(err)
        }
        
        res.json({message: "User removed!"})
      })
    }
  },

  // Accounts
  accounts: {
    getAll: function(req, res) {
      Account.find(function(err, accounts) {
        if (err) {
          res.status(422)
          res.send(err)
        }
        
        res.send(accounts)
      })
    },

    getOne: function(req, res) {
      Account.findById(req.params.id, function(err, account) {
        if (err) {
          res.status(422)
          res.send(err)
        }
        
        res.send(account)
      })
    },

    create: function(req, res) {
      Account.create(req.body.account, function(err, account) {
        if (err) {
          res.status(422)
          res.send(err)
        }

        User.where('_id').in(account.users).exec(function(err, users) {
          if (err) {
            res.status(422)
            res.send(err)
          }

          for(var i = 0; i < users.length; i++) {
            users[i].accounts.push(account.id);
            users[i].save(function(err) {if (err) res.send(err)});
          }
          res.send(account)
        })
      })
    },

    update: function(req, res) {
      Account.findById(req.params.id, function(err, account) {
        if (err) {
          res.status(422)
          res.send(err)
        }
        
        account.update(req.body.account, function(err, account) {
          if (err) {
            res.status(422)
            res.send(err)
          }
        })
      })
    },

    delete: function(req, res) {
      Account.findById(req.params.account_id, function(err, account) {
        if (err) {
          res.status(422)
          res.send(err)
        }

        // Remove the account and its reference in associated users
        User.where('_id').in(account.users).exec(function(err, users) {
          if (err) {
            res.status(422)
            res.send(err)
          }

          for(var i = 0; i < users.length; i++) {
            users[i].accounts.remove(account.id);
            users[i].save(function(err) {if (err) res.send(err)});
          }

          account.remove({
            _id: req.params.account_id
          }, function(err) {
            if (err) {
              res.status(422)
              res.send(err)
            }
            
            res.send({message: "Account removed!"})
          })
        })
      })
    }
  },

  // Transactions
  transactions: {
    getAll: function(req, res) {
      Transaction.find(function(err, transactions) {
        if (err) {
          res.status(422)
          res.send(err)
        }

        res.send(transactions)
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
    },

    create: function(req, res) {
      Transaction.create(req.body.transaction, function(err, transaction) {
        if (err) {
          res.status(422)
          res.send(err)
        }

        res.send(transaction)
      })
    },

    update: function(req, res) {
      Transaction.findById(req.params.id, function(err, transaction) {
        if (err) {
          res.status(422)
          res.send(err)
        }

        transaction.update(req.body.transaction, function(err, transaction) {
          if (err) {
            res.status(422)
            res.send(err)
          }

          res.send(transaction)
        })
      })
    },

    delete: function(req, res) {
      Transaction.remove({
        _id: req.params.id
      }, function(err, asset) {
        if (err) {
          res.status(422)
          res.send(err)
        }
        
        res.send(message: "Transaction removed!")
      })
    }
  },

  // Assets
  assets: {
    /* GET all assets */
    getAll: function(req, res) {
      Asset.find(function(err, assets) {
        if (err) {
          res.status(422)
          res.send(err)
        }
          
        // Get asset information from the blockchain
        blockchainAssets = [];
        for (var i = 0; i < assets.length; i++) {
          colu.coloredCoins.getAssetData({assetId: assets[i].id}, function(err, body) {
            if (err) {
              res.status(422)
              res.send(err)
            }
            blockchainAssets.push(body);
          })
        }
        res.json(blockchainAssets);
      })
    },

    /* GET asset */
    getOne: function(req, res) {
      Asset.findById(req.params.id, function(err, asset) {
        if (err) {
          res.status(422)
          res.send(err)
        }

        // Get data from blockchain
        colu.coloredCoins.getAssetData({assetId: asset.id}, function(err, body) {
          if (err) {
            res.status(422)
            res.send(err)
          }
          res.json(JSON.stringify(body));
        })
      })
    },

    /* CREATE asset */
    create: function(req, res) {
      var assetName = req.body.name
      var assetDescription = req.body.description
      var amount = req.body.amount

      // Need to be more flexible here to accept potentially lots of different information but also make sure not anything can be sent
      var settings = {
        metadata: {
         'assetName': assetName,
         'description': assetDescription
        },
        'amount': amount,
        'divisibility': "0"
      }

      colu.issueAsset(settings, function (err, result) {
        if (err) {
          res.status(422)
          res.send(err)
        }

        // Need to save more info about the asset here
        var asset = new Asset({
          assetId: result.assetId
        });

        // Create transaction for record keeping
        Transaction.create({txId: result.txid, type: "Issue"}, function(err, transaction) {if (err) console.log(err)});

        asset.save(function(err) {
          if (err) {
            res.status(422)
            res.send(err)
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
        if (err) {
          res.status(422)
          res.send(err)
        }

        var assetId = asset.assetId
        var toAddress = req.body.toAddress
        var fromAddress = asset.issueAddress
        var amount = req.body.amount

        var settings = {
          'from': [fromAddress],
          'to': [{
            'address': address,
            'assetId': assetId,
            'amount': amount
          }]
        }
        colu.sendAsset(settings, function (err, result) {
          if (err) {
            res.status(422)
            res.send(err)
          }
          
          // Create transaction for record keeping
          Transaction.create({txId: result.txid, type: "Issue"}, function(err, transaction) {if (err) console.log(err)});

          res.send({ message: "Asset sent!"})
        })
      })
    },

    /* UPDATE asset */
    update: function(req, res) {
      // Not sure there is much to update so this method may be unnecessary
      Asset.findById(req.params.id, function(err, asset) {
        if (err) {
          res.status(422)
          res.send(err)
        }

        // Update many different fields potentially here
        asset.save(function(err) {
          if (err) {
            res.status(422)
            res.send(err)
          }
          
          // Can we also update info of the asset on the blockchain?
          res.send({ message: "Asset updated!"});
        })
      })
    },

    /* DELETE asset */
    delete: function(req, res) {
      // Not sure if we should have this functionality or not since you can't actually
      // remove assets from the Blockchain.
      Asset.remove({
        _id: req.params.id
      }, function(err, asset) {
        if (err) {
          res.status(422)
          res.send(err)
        }
        
        // Remove from the blockchain?
        res.json({message: "Asset removed!"})
      })
    }
  }

  // Customers
  customers: {
    getAll: function(req, res) {
      User.where('role').equals('Customer').exec(function(err, users) {
        if (err) {
          res.status(422)
          res.send(err)
        }

        res.send(users)
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
    }
  }
}

module.exports = admin;