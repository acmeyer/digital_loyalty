var Asset = require('../models/asset');
var Account = require('../models/account');
var Transaction = require('../models/transaction');

var assets = {

  /* GET all assets */
  getAll: function(req, res) {
    findAccount(req.params.account_id, function(err, account) {
      if (account.walletAddress) {
        colu.coloredCoins.getAddressInfo({address: account.walletAddress}, function(err, body) {
          if (err) res.send(err);
          res.send(body.assets);
        })
      } else {
        // There is no wallet address for this account yet so just return an empty array.
        res.send([]);
      }
    })
  },

  /* GET asset */
  getOne: function(req, res) {
    Asset.findById(req.params.id, function(err, asset) {
      if (err) res.send(err)

      // Get data from blockchain
      colu.coloredCoins.getAssetData({assetId: asset.id}, function(err, body) {
        if (err) res.send(err);
        res.send(body);
      })
    })
  },

  /* CREATE asset */
  create: function(req, res) {
    findAccount(req.params.account_id, function(err, account) {
      if (err) res.send(err);

      var assetName = req.body.name
      var assetDescription = req.body.description
      var amount = req.body.amount

      // Need to be more flexible here to accept potentially lots of different information but also make sure not anything can be sent
      var settings = {
        metadata: {
         'assetName': assetName,
         'issuer': account.name,
         'description': assetDescription
        },
        'amount': amount,
        'divisibility': "0"
      }

      if (account.walletAddress) settings.issueAdress = account.walletAddress;

      colu.issueAsset(settings, function (err, result) {
        if (err) return res.send(err)
        // Need to save more info about the asset here
        var asset = new Asset({
          assetId: result.assetId
        });

        // // if an account's wallet address is empty, 
        // // populate it with the returned asset issue address
        if (account.walletAddress === null || account.walletAddress === 'undefined') {
          account.update({walletAddress: result.issueAdress}, function (err, raw) {
            if (err) return res.send(err);
          })
        }
        
        // record the transaction for later access
        createTransaction(result.txId, "Issue", account);

        asset.save(function(err) {
          if (err) {
            res.send(err);
          } else {
            res.status(200);
            res.send({message: 'Created asset!'});
          }
        })
      })
    });
  },

  /* SEND asset */
  send: function(req, res) {
    findAccount(req.params.account_id, function(err, account) {
      if (err) res.send(err);
      
      Asset.findById(req.params.id, function(err, asset) {
        if (err) res.send(err);

        var assetId = asset.assetId
        var toAddress = req.body.toAddress
        var fromAddress = account.walletAddress
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
          if (err) return send(err);

          // record the transaction for later access
          createTransaction(result.txId, "Send", account);
          
          res.send({ message: "Asset sent!"});
        })
      })  
    });
  },

  /* UPDATE asset */
  update: function(req, res) {
    // Not sure there is much to update so this method may be unnecessary
    Asset.findById(req.params.id, function(err, asset) {
      if (err) res.send(err);

      // Update many different fields potentially here
      asset.save(function(err) {
        if (err) res.send(err);
        
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
      _id: req.params.asset_id
    }, function(err, asset) {
      if (err) res.send(err);
      
      res.send({message: "Asset removed!"})
    })
  }
}

function findAccount (account_id, cb) {
  Account.findById(account_id, function(err, account) {
    if (err) return cb(err);
    
    return cb(null, account);
  })
}

function createTransaction (txId, type, account) {
  Transaction.create({txId: txId, type: type}, function(err, transaction) {
    if (err) console.log(err); // silently fail
    account.transactions.push(transaction);
    account.save(function(err) {if (err) console.log(err)});
    return;
  });
}

module.exports = assets;
