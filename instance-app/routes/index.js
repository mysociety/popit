"use strict"; 

var Error404 = require('../../lib/errors').Error404,
    async    = require('async'),
    _        = require('underscore');

exports.route = function (app) {

  app.get('/search',  require('../../lib/apps/search').search );

  app.get('/', function(req, res, next){

    var summary_listing_count = 5;

    async.parallel(
      {
        persons: function (callback) {
          req.popit
            .model('Person')
            .find()
            .limit(summary_listing_count)
            .exec(callback);
        },
        person_count: function (callback) {
          req.popit
            .model('Person')
            .count()
            .exec(callback);            
        },
        organizations: function (callback) {
          req.popit
            .model('Organization')
            .find()
            .limit(summary_listing_count)
            .exec(callback);
        },
        organization_count: function (callback) {
          req.popit
            .model('Organization')
            .count()
            .exec(callback);            
        }
      },
      function(err, results) {
        if (err) return next(err);
        res.locals = _.extend(res.locals, results);
        res.locals.summary_listing_count = summary_listing_count;
        res.render('index.html');
      }
    );

  });

  app.get('/welcome', function (req, res) {
    res.render('welcome.html');
  });

  // Throw a 404 error
  app.all('/*', function(req, res, next) {
    next(new Error404());
  });

};

