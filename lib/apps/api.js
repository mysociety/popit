var express       = require('express');

var app = module.exports = express.createServer();

app.mounted( function (parent) {

  this.get('/', function (req, res, next) {
    res.json([]);
  });   

});

