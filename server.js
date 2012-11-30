"use strict";

/**
 * Module dependencies.
 */

var express        = require('express'),
    // connect        = require('connect'),
    config         = require('config'),
    winston        = require('./lib/popit_winston'),
    hosting_app    = require('./hosting-app/app'),
    utils          = require('./lib/utils'),
    format         = require('util').format,
    instance_app   = require('./instance-app/app');

var app = express();

// Intercept JSON content type GET requests and change the header.
// this is a workaround for https://github.com/senchalabs/connect/issues/680 which hopefully will be fixed upstream
app.use( function (req, res, next) {
  if ( req.method == "GET" && req.headers['content-type'] == 'application/json' ) {
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
