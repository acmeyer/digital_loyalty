var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Customer = new Schema({
  address: String
});

module.exports = mongoose.model('Customer', Customer);