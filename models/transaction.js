var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
  txId: String,
  type: String
}, {timestamps: true});

module.exports = mongoose.model('Transaction', TransactionSchema);