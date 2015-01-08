"use strict"; 

var express = require('../../express-inherit'),
    apiRequireUser = require('../../apps/auth').apiRequireUser,
    about = require('../about'),
    config = require('config'),
    user = require('../../authorization'),
    popitApi01 = require('popit-api-0.1'),
    popitApi = require('popit-api');

var app = module.exports = express();

// Pretty print json in production as well as development
app.set('json spaces', 2);

function generateApiBaseUrl(req, version) {
  return req.base_url('/api/v' + version);
}

function setupApp(api_ver, version) {

  // Ensure that these methods all require a user.
  api_ver.post( '*', apiRequireUser, user.can('edit instance') );
  api_ver.put(  '*', apiRequireUser, user.can('edit instance') );
  api_ver.delete(  '*', apiRequireUser, user.can('edit instance') );

  app.use(function(req, res, next) {
    req.baseUrl = req.base_url();
    next();
  });

  api_ver.get('/', function (req, res, next) {
    var apiBaseUrl = generateApiBaseUrl(req, version);
    res.jsonp({
      note: "This is the API entry point - use a '*_api_url' link in 'meta' to search a collection.",
      meta: {
        persons_api_url: apiBaseUrl + '/persons',
        organizations_api_url: apiBaseUrl + '/organizations',
        memberships_api_url: apiBaseUrl + '/memberships',
        posts_api_url: apiBaseUrl + '/posts',
        image_proxy_url: req.baseUrl + config.image_proxy.path,
      },
    });
  });

  api_ver.get('/about', function (req, res, next) {
    var about_object = about();
    var about_info = about_object.load_about_data(req, function(result){
      res.jsonp({
        'result' : result,
      });
    });
  });

  return api_ver;
}

var api_01_app = express();
api_01_app = setupApp(api_01_app, '0.1');

var api_02_app = express();
api_02_app = setupApp(api_02_app, '0.2');

api_01_app.use( function(req, res, next) {
    var db_name = config.MongoDB.popit_prefix + req.popit.dbname();
    popitApi01({
      databaseName: db_name,
      baseUrl: req.baseUrl,
      apiBaseUrl: req.base_url('/api/v0.1'),
      proxyBaseUrl: req.base_url(config.image_proxy.path),
      defaultLanguage: req.popit.setting('language'),
    })(req, res, next);
});

api_02_app.use( function(req, res, next) {
    var db_name = config.MongoDB.popit_prefix + req.popit.dbname();
    popitApi({
      databaseName: db_name,
      baseUrl: req.baseUrl,
      apiBaseUrl: req.base_url('/api/v0.2'),
      proxyBaseUrl: req.base_url(config.image_proxy.path),
      defaultLanguage: req.popit.setting('language'),
    })(req, res, next);
});
// Load the various different API versions
app.use( '/v0.1', api_01_app );
app.use( '/v0.2', api_02_app );
app.use( '/current', api_02_app );

app.get('/', function (req, res) {
  res.render('api/index.html');
});     

app.all('*', function(req, res, next) {
  // 404
  res.json({ error: "page not found"}, 404);
});
