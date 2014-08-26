"use strict"; 

var express = require('../../express-inherit'),
    apiRequireUserOrGuest = require('../../apps/auth').apiRequireUserOrGuest,
    base_url = require('../../middleware/route').base_url,
    about = require('../about'),
    config = require('config'),
    user = require('../../authorization'),
    popitApi = require('popit-api');

var app = module.exports = express();

var api_01_app = express();
// Ensure that these methods all require a user.
api_01_app.post( '*', apiRequireUserOrGuest, user.can('edit instance') );
api_01_app.put(  '*', apiRequireUserOrGuest, user.can('edit instance') );
api_01_app.del(  '*', apiRequireUserOrGuest, user.can('edit instance') );

app.use(function(req, res, next) {
  req.base_url = base_url(req);
  req.api_base_url = req.base_url + '/api/v0.1';
  next();
});

api_01_app.get('/', function (req, res, next) {
  res.jsonp({
    note: "This is the API entry point - use a '*_api_url' link in 'meta' to search a collection.",
    meta: {
      persons_api_url: req.api_base_url + '/persons',
      organizations_api_url: req.api_base_url + '/organizations',
      memberships_api_url: req.api_base_url + '/memberships',
      posts_api_url: req.api_base_url + '/posts',
      image_proxy_url: base_url(req) + config.image_proxy.path,
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
    var db_name = config.MongoDB.popit_prefix + req.popit.instance_name();
    popitApi({
      databaseName: db_name,
      baseUrl: req.base_url,
      apiBaseUrl: req.api_base_url,

      // TODO: Make this configurable through the UI
      defaultLanguage: 'en',

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
