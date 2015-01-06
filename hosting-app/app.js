"use strict";

/**
 *  Hosting server
 */

var express           = require('express'),
    config            = require('config'),
    setupTemplates    = require('../lib/templates'),
    masterSelector    = require('../lib/middleware/master-selector'),
    assets            = require('connect-assets'),
    passport          = require('../lib/passport'),
    bodyParser        = require('body-parser'),
    multer            = require('multer');


var app = module.exports = express();

app.enable('trust proxy');

setupTemplates(app, __dirname + '/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.methodOverride());
app.use(assets({ paths: [ config.public_dir + '/js', config.public_dir + '/css' ] }));

app.use( require('../lib/middleware/config') );

app.use(masterSelector());

app.use(passport.initialize());
app.use(passport.session());

app.use(require('../lib/authorization').middleware());

app.use(require('../lib/apps/auth').middleware);

app.use( '/docs', require('../lib/apps/docs.js')() );
app.use('/info', require('../lib/apps/info')() );

app.use(require('../lib/apps/registration'));
app.use(require('../lib/apps/login'));
app.use(require('../lib/apps/apikey'));

if (app.get('env') === 'development' || app.get('env') === 'testing') {
  var helpers = require('../lib/apps/dev-helpers');
  app.use( '/_dev', helpers() );
}

app.use(app.router);
app.use( require('../lib/errors').errorHandler );

if (app.get('env') === 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

if (app.get('env') === 'production') {
  app.use(express.errorHandler());
}

// Routes
require('./routes').route(app);
