"use strict"; 

var express = require('../../express-inherit'),
    apiRequireUser = require('../../apps/auth').apiRequireUser,
    about = require('../about'),
    config = require('config'),
    cors = require('cors'),
    user = require('../../authorization'),
    popitApi = require('popit-api');

var app = module.exports = express();

// Pretty print json in production as well as development
app.set('json spaces', 2);

var api_01_app = express();
// Ensure that these methods all require a user.
api_01_app.post( '*', apiRequireUser, user.can('edit instance') );
api_01_app.put(  '*', apiRequireUser, user.can('edit instance') );
api_01_app.delete(  '*', apiRequireUser, user.can('edit instance') );

api_01_app.get( '*', cors() );

app.use(function(req, res, next) {
  req.baseUrl = req.base_url();
  req.apiBaseUrl = req.base_url('/api/v0.1');
  next();
});

api_01_app.get('/', function (req, res, next) {
  res.jsonp({
    note: "This is the API entry point - use a '*_api_url' link in 'meta' to search a collection.",
    meta: {
      persons_api_url: req.apiBaseUrl + '/persons',
      organizations_api_url: req.apiBaseUrl + '/organizations',
      memberships_api_url: req.apiBaseUrl + '/memberships',
      posts_api_url: req.apiBaseUrl + '/posts',
      image_proxy_url: req.baseUrl + config.image_proxy.path,
    },
  });
});

api_01_app.get('/about', function (req, res, next) {
  var about_object = about();
  var about_info = about_object.load_about_data(req, function(result){
    res.jsonp({
      'result' : result,
    });
  });
});

api_01_app.use( function(req, res, next) {
    var db_name = config.MongoDB.popit_prefix + req.popit.dbname();
    popitApi({
      databaseName: db_name,
      baseUrl: req.baseUrl,
      apiBaseUrl: req.apiBaseUrl,
      defaultLanguage: req.popit.setting('language'),
    })(req, res, next);
});

// Load the various different API versions
app.use( '/v0.1', api_01_app );

app.get('/', function (req, res) {
  res.render('api/index.html');
});     

app.all('*', function(req, res, next) {
  // 404
  res.json({ error: "page not found"}, 404);
});
