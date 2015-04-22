"use strict";

// Helper script for starting and stopping the app server during the tests

var app = require('../../app');
var config = require('config');
var Browser = require('zombie');

Browser.localhost(config.hosting_server.host, config.server.port);

var server;

before(function() {
  server = app.listen(config.server.port);
});

after(function() {
  server.close();
});

