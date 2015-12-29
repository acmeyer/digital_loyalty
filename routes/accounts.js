var express = require('express');
var router = express.Router();

var Account = require('../models/account');

var accounts = {
  getAll: function(req, res) {
    res.json();
  },

  getOne: function(req, res) {
    res.json();
  },

  create: function(req, res) {
    res.json();
  },

  update: function(req, res) {
    res.json();
  },

  delete: function(req, res) {
    res.json();
  }
}

module.exports = accounts;