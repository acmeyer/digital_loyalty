var express = require('express');
var router = express.Router();

var User = require('../models/user');

var users = {
  me: function(req, res) {
    res.send();
  },

  send: function(req, res) {
    res.send();
  },

  redeem: function(req, res) {
    res.send();
  }
}

module.exports = users;