"use strict";

var express = require('express');
var config = require('config');
var hosting_app = require('./hosting-app/app');
var instance_app = require('./instance-app/app');

var app = module.exports = express();

// Intercept JSON content type GET requests and change the header.
// this is a workaround for https://github.com/senchalabs/connect/issues/680 which hopefully will be fixed upstream
app.use( function (req, res, next) {
  if ( (req.method == "GET" || req.method == "DELETE" ) && req.headers['content-type'] == 'application/json' ) {
    delete req.headers['content-type'];
  }
  next();
});

// match the hosting app host...
app.use(
  express.vhost(
    config.hosting_server.host,
    hosting_app
  )
);

// ...or fall through to the instance app
app.use(instance_app);
