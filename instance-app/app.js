"use strict"; 


/**
 *  Instance Server
 */

var express           = require('express'),
    mongoose          = require('mongoose'),
    config            = require('config'),
    winston           = require('winston'),
    utils             = require('../lib/utils'),
    instanceSelector  = require('../lib/middleware/instance-selector'),
    Db                = require('mongodb').Db,
    Server            = require('mongodb').Server,
    mongoStore        = require('connect-mongodb'),
    image_proxy       = require('connect-image-proxy'),
    connect_flash     = require('connect-flash'),
    Template          = require('../lib/templates'),
    current_absolute_pathname = require('../lib/middleware/route').current_absolute_pathname;



var app = module.exports = express();

// put in null values here so that the templates can all be consistent, even in
// the edge cases where an instance has not been loaded, or a user is not logged in.
app.locals({
  user: null,
  popit: null,
});


// Configuration

app.configure('development', function(){
  app.use(express.logger('dev'));
});

app.configure('production', function(){
  app.use(express.logger());
});

var template = new Template();
template.cacheTemplates = app.get('env') == 'development' ? false : true;

app.configure(function(){
    
  app.set('views', __dirname + '/views');
  app.engine('html', template.forExpress() );
    
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

app.configure('development', function () {
  app.use( '/js/templates.js', template.middlewareAMD() );
});

app.configure( function () {
  app.use(express.static(__dirname + '/../' + config.public_dir));
  
  // sessions and auth
  app.use( express.cookieParser( config.instance_server.cookie_secret ) );
  var session_db_name = config.MongoDB.popit_prefix + config.MongoDB.session_name;
  var session_server  = new Server(
      config.MongoDB.host,
      config.MongoDB.port,
      {
        auto_reconnect: true,
        native_parser: true,
      }
  );
  var session_db = new Db( session_db_name, session_server, {safe: true} );
  var session_store = new mongoStore({ db: session_db });
  
  app.use( express.session({
      secret: config.instance_server.cookie_secret,
      store: session_store,
  }) );
  
  // set up the flash and make it available to the templates - https://gist.github.com/3070950
  app.use( connect_flash() );
  app.use( function (req, res, next) {
    res.locals.flash = req.flash.bind(req);
    next();
  });

  app.use( function (req,res,next) {
    res.locals.current_absolute_pathname = current_absolute_pathname(req);
    next();    
  });
  
  app.use( require('../lib/middleware/config')() );
  app.use(instanceSelector());
  
  app.use( require('../lib/apps/auth').middleware );
  app.use( require('../lib/apps/auth').app );

  app.use('/api',   require('../lib/apps/api') );

  app.use('/info',   require('../lib/apps/info')() );
  app.use('/token',  require('../lib/apps/token') );

  app.use('/autocomplete',   require('../lib/apps/autocomplete') );

  app.use('/migration',      require('../lib/apps/migration')() );
  app.use('/person',         require('../lib/apps/person')() );
  app.use('/position',       require('../lib/apps/position')() );
  app.use('/organisation',   require('../lib/apps/organisation')() );
  app.use('/about',          require('../lib/apps/about')() );

  app.use(config.image_proxy.path , image_proxy() );

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


require('./routes').route(app);      


