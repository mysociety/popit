
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
  app.use(masterSelector());
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  app.set('view options', { layout: false, pretty: true, });
  app.register('.txt',  expressHogan);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/../public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
require('./routes').route(app);


app.listen( config.hosting_server.port );
console.log(
    "PopIt Hosting server listening on port %d in %s mode: %s",
    app.address().port, app.settings.env, config.hosting_server.domain
);
