var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
  txId: String
});

module.exports = mongoose.model('Transaction', TransactionSchema);