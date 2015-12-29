var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
  name: String
});

module.exports = mongoose.model('Account', Account);