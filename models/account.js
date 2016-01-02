var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
  name: String,
  walletAddress: String,
  creator: { type: Schema.Types.ObjectId, ref: 'User'}, // limit to role 'Merchant'?
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }], // limit to role 'Merchant'?
  customers: [{ type: Schema.Types.ObjectId, ref: 'User' }] // limit to role 'Customer'?
});

module.exports = mongoose.model('Account', AccountSchema);