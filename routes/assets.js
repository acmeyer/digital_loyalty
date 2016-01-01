var express = require('express');
var router = express.Router();

var Asset = require('../models/asset');

var assets = {

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

      // if an account's wallet address is empty, 
      // populate it with the returned asset issue address
      // if (!account.walletAddress) account.update({walletAddress: result.issueAdress}, function (err, raw) {
      //   if (err) return res.send(err);
      // });

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

module.exports = assets;
