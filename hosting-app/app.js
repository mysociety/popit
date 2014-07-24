"use strict"; 

/**
 *  Hosting server
 */

var express           = require('express'),
    config            = require('config'),
    engines           = require('consolidate'),
    UTA               = require('underscore-template-additions'),
    masterSelector    = require('../lib/middleware/master-selector'),
    passport          = require('../lib/passport');


var app = module.exports = express();

app.locals({
  user:  null,
  guest: null,
  popit: null,
});

var templates = new UTA();
templates.cacheTemplates = app.get('env') == 'development' ? false : true;

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.engine('html', templates.forExpress() );
  app.engine('txt',  engines.hogan);

  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.locals( require('../lib/middleware/config') );

  app.use(masterSelector());

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(require('../lib/authorization').middleware());

  app.use(require('../lib/apps/auth').middleware);

  app.use( '/docs', require('../lib/apps/docs.js')() );
  app.use('/info', require('../lib/apps/info')() );

  app.use(require('../lib/apps/registration'));
  app.use(require('../lib/apps/login'));
});

app.configure('development', 'testing', function() {
  var helpers = require('../lib/apps/dev-helpers');
  app.use( '/_dev', helpers() );
});


app.configure(function(){
  app.use(app.router);
  app.use( require('../lib/errors').errorHandler );
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
require('./routes').route(app);


