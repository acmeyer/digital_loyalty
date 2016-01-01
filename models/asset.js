var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AssetSchema = new Schema({
  assetId: String
}, {timestamps: true});

module.exports = mongoose.model('Asset', AssetSchema);