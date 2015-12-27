var express = require('express');
var router = express.Router();

var Asset = require('../models/asset');

var assets = {
  /* GET all assets */
  getAll: function(req, res) {
    Asset.find(function(err, assets) {
      if (err) {
        res.send(err);
      } else {
        
        // Also get data from blockchain here
        
        res.send(assets);
      }
    })
  },

  /* GET asset */
  getOne: function(req, res) {
    Asset.findById(req.params.id, function(err, asset) {
      if (err) {
        res.send(err)
      } else {
        // Also get data from blockchain here

        res.send(asset)
      }
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
        assetName: assetName,
        amount: amount,
        assetId: result.assetId,
        issueAddress: result.issueAdress
      });

      asset.save(function(err) {
        if (err) {
          res.send(err);
        } else {
          res.json({message: 'Created asset!'});
        }
      })
    })
  },

  /* SEND asset */
  send: function(req, res) {
    Asset.findById(req.params.id, function(err, asset) {
      if (err) {
        res.send(err)
      } else {
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
          asset.amount -= 1

          // Also want to save transaction information here

          asset.save(function(err) {
            if (err) {
              res.send(err)
            } else {
              res.json({ message: "Asset sent!"})
            }
          })
        })
      }
    })
  },

  /* UPDATE asset */
  update: function(req, res) {
    Asset.findById(req.params.id, function(err, asset) {
      if (err) {
        res.send(err)
      } else {
        // Update many different fields potentially here
        asset.assetName = req.body.assetName;
        asset.save(function(err) {
          if (err) {
            res.send(err);
          } else {
            // Can we also update info of the asset on the blockchain?
            res.json({ message: "Asset updated!"});
          }
        })
      }
    })
  },

  /* DELETE asset */
  delete: function(req, res) {
    Asset.remove({
      _id: req.params.asset_id
    }, function(err, asset) {
      if (err) {
        res.send(err)
      } else {
        // Remove from the blockchain?
        res.json({message: "Asset removed!"})
      }
    })
  }
}

module.exports = assets;
