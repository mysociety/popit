"use strict"; 

var Error404 = require('../../lib/errors').Error404,
    async    = require('async');

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
        organisations: function (callback) {
          req.popit
            .model('Organisation')
            .find()
            .limit(summary_listing_count)
            .exec(callback);
        },
        organisation_count: function (callback) {
          req.popit
            .model('Organisation')
            .count()
            .exec(callback);            
        }
      },
      function(err, results) {
        if (err) return next(err);
        res.locals(results);
        res.locals({ summary_listing_count: summary_listing_count });
        res.render('index');
      }
    );

  });

  app.get('/welcome', function (req, res) {
    res.render('welcome');
  });

  // Throw a 404 error
  app.all('/*', function(req, res, next) {
    next(new Error404());
  });

};

