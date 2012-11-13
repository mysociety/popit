"use strict"; 

/**
 *  Hosting server
 */

var express           = require('express'),
    mongoose          = require('mongoose'),
    config            = require('config'),
    utils             = require('../lib/utils'),
    masterSelector    = require('../lib/middleware/master-selector'),
    engines           = require('consolidate'),
    UTA               = require('underscore-template-additions');


var app = module.exports = express();


// Configuration
app.configure('development', function(){
  app.use(express.logger('dev'));
});

app.configure('production', function(){
  app.use(express.logger());
});

var templates = new UTA();
templates.cacheTemplates = app.get('env') == 'development' ? false : true;

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.engine('html', templates.forExpress() );
  app.engine('txt',  engines.hogan);

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/../' + config.public_dir));

  app.use( require('../lib/middleware/config')() );
  app.use(masterSelector());

  app.use('/info', require('../lib/apps/info')() );
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


