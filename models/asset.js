var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AssetSchema = new Schema({
  assetName: String,
  amount: Number,
  assetId: String,
  issueAddress: String
});

module.exports = mongoose.model('Asset', AssetSchema);