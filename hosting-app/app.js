
/**
 *  Hosting server
 */

var express           = require('express'),
    expressHogan      = require('express-hogan.js'),
    mongoose          = require('mongoose'),
    config            = require('config'),
    utils             = require('../lib/utils'),
    masterSelector    = require('../lib/middleware/master-selector');


var app = module.exports = express.createServer();


// Configuration
app.configure('development', function(){
  app.use(express.logger('dev'));
});

app.configure('production', function(){
  app.use(express.logger());
});

app.configure(function(){
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  app.set('view options', { layout: false, pretty: true, });
  app.register('.txt',  expressHogan);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/../' + config.public_dir));

  app.use( require('../lib/middleware/config')() );
  app.use(masterSelector());

  app.use('/info', require('../lib/apps/info')() );
  app.use('/instanceinfo', require('../lib/apps/instanceinfo')() );
  app.use(app.router);
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


