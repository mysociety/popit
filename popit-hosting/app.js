
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , expressHogan = require('express-hogan.js');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.register('.html', expressHogan);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.logger({ format: ':method :status :url' }));
  
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/new', routes.new);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
