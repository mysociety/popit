"use strict"; 

var express = require('../../express-inherit');

var app = module.exports = express();

// Load the various different API versions
app.use( '/v0.1', require('./api_v0-1') );
app.use( '/v1',   require('./api_v1')   );

app.get('/', function (req, res) {
  res.render('api/index.html');
});     

app.all('*', function(req, res, next) {
  // 404
  res.json({ error: "page not found"}, 404);
});
