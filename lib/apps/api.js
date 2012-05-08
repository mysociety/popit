var express       = require('express');

var app = module.exports = express.createServer();

app.mounted( function (parent) {

  this.get('/', function (req, res, next) {
    res.json([]);
  });   


  this.all('*', function(req, res, next) {
    // 404
    res.json({ error: "page not found"}, 404);
  });

});

