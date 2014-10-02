"use strict";

/**
 *  Instance Server
 */

var express           = require('express'),
    config            = require('config'),
    assets            = require('connect-assets'),
    instanceSelector  = require('../lib/middleware/instance-selector'),
    checkInstanceAvailable = require('../lib/middleware/check-instance-available'),
    image_proxy       = require('image-proxy/lib/proxy'),
    UTA               = require('underscore-template-additions'),
    engines           = require('consolidate'),
    popitApiStorageSelector = require('popit-api/src/middleware/storage-selector'),
    passport          = require('../lib/passport');

var app = module.exports = express();

// put in null values here so that the templates can all be consistent, even in
// the edge cases where an instance has not been loaded, or a user is not logged in.
app.locals({
  user:  null,
  popit: null,
});


// Configuration

var templates = new UTA();
templates.cacheTemplates = app.get('env') == 'development' ? false : true;

app.set('views', __dirname + '/views');
app.engine('html', templates.forExpress() );
app.engine('txt',  engines.hogan);

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(assets({ paths: [ config.public_dir + '/js', config.public_dir + '/css' ] }));

app.use(passport.initialize());
app.use(passport.session());

app.use(require('../lib/authorization').middleware());

app.locals( require('../lib/middleware/config') );
app.use(instanceSelector());
app.use(checkInstanceAvailable());
app.use(popitApiStorageSelector({
  storageSelector: 'popit',
  databasePrefix: config.MongoDB.popit_prefix
}));

app.use( require('../lib/apps/auth').middleware );
app.use( require('../lib/apps/auth').app );

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
app.use('/admin',          require('../lib/apps/admin'));

app.use(config.image_proxy.path , image_proxy() );

if (app.get('env') === 'development' || app.get('env') === 'testing') {
  var helpers = require('../lib/apps/dev-helpers');
  app.use( '/_dev', helpers() );
}

app.use(app.router);
app.use( require('../lib/errors').errorHandler );

if (app.get('env') === 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

if (app.get('env') === 'production') {
  app.use(express.errorHandler());
}


require('./routes').route(app);
