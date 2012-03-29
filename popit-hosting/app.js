
/**
 * Module dependencies.
 */

var express       = require('express'),
    expressHogan  = require('express-hogan.js'),
    mongoose      = require('mongoose'),
    nodemailer    = require('nodemailer'),
    utils         = require('./lib/utils');


// Connect to the default database
mongoose.connect( utils.mongodb_connection_string() );

var app = module.exports = express.createServer();

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

app.nodemailer_transport = nodemailer.createTransport("Sendmail");

// Routes
require('./routes').route(app);


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
