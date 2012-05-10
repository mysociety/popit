var express = require('express');

var app
  = module.exports
  = express.createServer();

app.use( '/v1', require('./api_v1') );

app.get('/', function (req, res) {
  res.send('home');
});     

app.all('*', function(req, res, next) {
  // 404
  res.json({ error: "page not found"}, 404);
});
