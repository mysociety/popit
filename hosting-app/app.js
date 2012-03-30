
/**
 * Module dependencies.
 */

var express       = require('express'),
    expressHogan  = require('express-hogan.js'),
    mongoose      = require('mongoose'),
    utils         = require('../lib/utils'),
    config        = require('config');


var app = module.exports = express.createServer();


// Connect to the default database, and close it when the app closes
mongoose.connect( utils.mongodb_connection_string( config.MongoDB.master_name ) );
app.on('close', function() {
    mongoose.close();
});


// Configuration

app.configure(function(){
  app.use(express.logger('dev'));
  app.set('views', __dirname + '/views');
  app.register('.txt',  expressHogan);
  app.register('.html', expressHogan);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
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
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
