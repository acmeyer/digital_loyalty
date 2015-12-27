var express = require('express');
var router = express.Router();

var Customer = require('../models/customer');

var customers = {
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

module.exports = customers;