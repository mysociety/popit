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
            .exec(function(err, persons) {
              if (err) return next(err);
              async.map(persons, function(person, done) {
                person.currentMemberships(function(err, memberships) {
                  if (err) {
                    return done(err);
                  }
                  var membershipWithRole = _.find(memberships, function(m) { return m.role });
                  if (membershipWithRole) {
                    person.position = membershipWithRole.role + ' at ' + membershipWithRole.organization_id.name;
                  }
                  done(null, person);
                });
              }, callback);
            });
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
        res.locals.current_step = undefined;

        if (results.person_count + results.organization_count === 0){
            res.locals.current_step = 1;
        } else if (typeof req.popit.setting('name') === 'undefined') {
            res.locals.current_step = 2;
        } else if (false) {
            res.locals.current_step = 3;
        }

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

