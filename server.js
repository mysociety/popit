"use strict";

/**
 * Module dependencies.
 */

var app = require('./app');
var config = require('config');
var winston = require('./lib/popit_winston');
var format = require('util').format;
var utils = require('./lib/utils');

app.listen(config.server.port);

winston.info( 'started at: ' + new Date() );
winston.info(
  format(
    "PopIt hosting and instance apps started: http://%s:%s",
    config.hosting_server.host,
    config.server.port
  )
);

utils.checkDatabaseConnection();
