var User = require('../models/user');
var Asset = require('../models/asset');

var users = {
  me: function(req, res) {
    // Send back the info for current user
    res.send(req.user);
  },

  send: function(req, res) {
    // Send an asset from the current user to some other address
    try {
      if (req.params.asset_id.match(/^[0-9a-fA-F]{24}$/)) {
        Asset.findById(req.params.asset_id, function(err, asset) {
          if (err) res.send(err);

          if (!asset) {
            res.status(404);
            res.send({
              "status": 404,
              "message": "Asset not found."
            })
          }

          var fromAddress = req.user.walletAddress

          if (fromAddress) {
            var assetId = asset.assetId
            var toAddress = req.body.toAddress
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
              if (err) res.send(err)

              // Also want to save transaction information here
              res.json({ message: "Asset sent!"})
            })
          } else {
            res.status(422);
            res.send({
              "status": 422,
              "message": "Wallet address for user not found."
            })
          }
        })
      } else {
        res.status(422);
        res.send({
          "status": 422,
          "message": "Asset id not valid."
        })
      }
    } catch (err) {
      res.status(500);
      res.json({
        "status": 500,
        "message": "Oops something went wrong",
        "error": err
      });
    }
  }
}

module.exports = users;