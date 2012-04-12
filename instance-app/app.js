
/**
 *  Instance Server
 */

var express           = require('express'),
    expressHogan      = require('express-hogan.js'),
    mongoose          = require('mongoose'),
    config            = require('config'),
    utils             = require('../lib/utils'),
    instanceSelector  = require('../lib/middleware/instance-selector');

var app = module.exports = express.createServer();


// Configuration

app.configure(function(){
  app.use(express.logger('dev'));
  app.set('views', __dirname + '/views');
  app.register('.txt',  expressHogan);
  app.register('.html', expressHogan);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));

  app.use(instanceSelector());

  // sessions and auth
  app.use( express.cookieParser( config.instance_server.cookie_secret ) );
  app.use( express.cookieSession({ cookie: { maxAge: 86400 * 100 } }) );
  require('../everyauth-setup')(app);

  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
require('./routes').route(app);


app.listen( config.instance_server.port );
console.log(
    "PopIt Instance server listening on port %d in %s mode: foo.%s",
    app.address().port, app.settings.env, config.instance_server.domain_suffix
);
