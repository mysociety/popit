"use strict";

var express = require('express');
var config = require('config');
var hosting_app = require('./hosting-app/app');
var instance_app = require('./instance-app/app');
var passport = require('passport');
var masterSelector = require('./lib/middleware/master-selector');
var authApp = require('./lib/apps/auth');

var app = module.exports = express();

// Intercept JSON content type GET requests and change the header.
// this is a workaround for https://github.com/senchalabs/connect/issues/680 which hopefully will be fixed upstream
app.use( function (req, res, next) {
  if ( (req.method == "GET" || req.method == "DELETE" ) && req.headers['content-type'] == 'application/json' ) {
    delete req.headers['content-type'];
  }
  next();
});

// sessions and auth
app.use(express.cookieParser());

app.use(express.cookieSession({
  secret: config.instance_server.cookie_secret,
  cookie: { domain: config.instance_server.cookie_domain },
}));

app.use(masterSelector());

app.use(passport.initialize());
app.use(passport.session());

app.use(authApp.middleware);
app.use(authApp.app);

// match the hosting app host...
app.use(
  express.vhost(
    config.hosting_server.host,
    hosting_app
  )
);

// ...or fall through to the instance app
app.use(instance_app);
