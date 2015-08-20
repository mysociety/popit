"use strict";

var requireUser = require('../../lib/apps/auth').requireUser;
var format = require('util').format;
var config = require('config');
var Error404 = require('../../lib/errors').Error404;
var _ = require('underscore');
var PopIt = require('../../lib/popit');
var async = require('async');

exports.route = function (app) {

  app.get('/', function(req, res){
    res.render('index.html');
  });

  app.get('/instance_creation_disabled', function(req, res, next) {
    res.render('instance_creation_disabled.html');
  });

  app.get('/instances/new', requireUser, function(req, res, next) {
    return res.redirect('/instance_creation_disabled');
  });

  app.post('/instances/new', requireUser, function(req, res, next) {
    return res.redirect('/instance_creation_disabled');
  });

  app.get('/instances/:slug', function(req, res) {
    res.redirect(format(config.instance_server.base_url_format, req.param('slug')));
  });

  function findInstances(req, res, next) {
    req.instances = res.locals.instances = [];
    req.popit.model('Instance').find(function(err, instances) {
      if (err) {
        return next(err);
      }
      req.all_instances = res.locals.all_instances = instances;
      if (!req.user) {
        return next();
      }

      req.popit.permissions().find({ account: req.user.id }).populate('instance').exec(function(err, permissions) {
        if (err) {
          return next(err);
        }
        req.instances = res.locals.instances = permissions.map(function(permission) {
          return permission.instance;
        });

        next();
      });
    });
  }

  app.get('/instances', findInstances, function(req, res, next){
    res.render('instances.html');
  });

  app.get('/instances.json', findInstances, function(req, res, next) {
    if (!req.user) {
      return res.status(401).jsonp({ errors: ["You are not authenticated"] });
    }
    async.map(req.instances, function(instance, done) {
      var details = _.pick(instance, 'slug', 'created_date', 'base_url');
      var popit = new PopIt();
      popit.set_instance(instance.slug);
      popit.load_settings(function(err) {
        if (err) {
          return done(err);
        }
        var settings = popit._get_cached_settings();
        _.each(settings, function(value, key) {
          // Check that value is truth-y
          if (value) {
            details[key] = value;
          }
        });
        done(null, details);
      });
    }, function(err, result) {
      if (err) {
        return next(err);
      }
      res.jsonp({ result: result });
    });
  });

  // Throw a 404 error
  app.all('/*', function(req, res, next) {
    next(new Error404());
  });
};
