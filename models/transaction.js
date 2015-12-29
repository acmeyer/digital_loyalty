var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Transaction = new Schema({
  txId: String
});

module.exports = mongoose.model('Transaction', Transaction);