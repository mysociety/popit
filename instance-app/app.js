"use strict"; 

/**
 *  Instance Server
 */

var express           = require('express'),
    config            = require('config'),
    instanceSelector  = require('../lib/middleware/instance-selector'),
    image_proxy       = require('connect-image-proxy'),
    connect_flash     = require('connect-flash'),
    UTA               = require('underscore-template-additions'),
    current_absolute_pathname = require('../lib/middleware/route').current_absolute_pathname,
    engines           = require('consolidate'),
    popitApiStorageSelector = require('popit-api/src/middleware/storage-selector');

var app = module.exports = express();

// put in null values here so that the templates can all be consistent, even in
// the edge cases where an instance has not been loaded, or a user is not logged in.
app.locals({
  user:  null,
  guest: null,
  popit: null,
});


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
});

app.configure( function () {
  app.use(express.static(__dirname + '/../' + config.public_dir));
  
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
  
  app.locals( require('../lib/middleware/config') );
  app.use(instanceSelector());
  app.use(popitApiStorageSelector({
    storageSelector: 'popit',
    databasePrefix: config.MongoDB.popit_prefix
  }));
  

  app.use('/api',   require('../lib/apps/api') );

  app.use('/info',   require('../lib/apps/info')() );
  app.use('/token',  require('../lib/apps/token') );

  app.use('/autocomplete',   require('../lib/apps/autocomplete') );

  app.use('/migration',      require('../lib/apps/migration')() );
  app.use('/persons',        require('../lib/apps/person')() );
  app.use('/memberships',    require('../lib/apps/membership')() );
  app.use('/organizations',  require('../lib/apps/organization')() );
  app.use('/about',          require('../lib/apps/about')() );
  app.use('/suggestion',     require('../lib/apps/suggestion'));

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


