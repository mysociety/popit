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
    Template          = require('../lib/templates');


var app = module.exports = express();
var template = new Template();


// Configuration
app.configure('development', function(){
  app.use(express.logger('dev'));
});

app.configure('production', function(){
  app.use(express.logger());

  // don't reload the templates each time from disk
  template.cacheTemplates = true;
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.engine( 'html', template.forExpress() );
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


