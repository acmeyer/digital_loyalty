var express = require('express');
var router = express.Router();

var Transaction = require('../models/transaction');

var transactions = {
  getAll: function(req, res) {
    res.send();
  },

  getOne: function(req, res) {
    res.send();
  },

  create: function(req, res) {
    res.send();
  },

  update: function(req, res) {
    res.send();
  },

  delete: function(req, res) {
    res.send();
  }
}

module.exports = transactions;