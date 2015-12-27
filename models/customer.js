var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  address: String
});

module.exports = mongoose.model('Customer', CustomerSchema);