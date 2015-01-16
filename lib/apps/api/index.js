"use strict"; 

var express = require('../../express-inherit'),
    apiRequireUser = require('../../apps/auth').apiRequireUser,
    about = require('../about'),
    config = require('config'),
    user = require('../../authorization'),
    popitApi = require('popit-api');

var app = module.exports = express();

// Pretty print json in production as well as development
app.set('json spaces', 2);

app.enable('trust proxy');

var api_01_app = express();
// Ensure that these methods all require a user.
api_01_app.post( '*', apiRequireUser, user.can('edit instance') );
api_01_app.put(  '*', apiRequireUser, user.can('edit instance') );
api_01_app.delete(  '*', apiRequireUser, user.can('edit instance') );

app.use(function(req, res, next) {
  req.baseUrl = req.base_url();
  req.apiBaseUrl = req.base_url('/api/v0.1');
  next();
});

/*
 * This is here rather than in the api as it's information about
 * this instance so not an API call.
 */
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
      instanceName: req.popit.instance_name(),
      databaseName: db_name,
      baseUrl: req.baseUrl,
      apiBaseUrl: req.apiBaseUrl,
      proxyBaseUrl: req.base_url(config.image_proxy.path),
      defaultLanguage: req.popit.setting('language'),
    })(req, res, next);
});

// Load the various different API versions
app.use( '/', api_01_app );

app.get('/', function (req, res) {
  res.render('api/index.html');
});

app.all('*', function(req, res, next) {
  // 404
  res.json({ error: "page not found"}, 404);
});
