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
    // Redirect production site to the documentation site for now.
    // TODO: Undo this once we're happy with the homepage.
    if (req.host === 'popit.mysociety.org') {
      res.redirect('http://popit.poplus.org/');
    } else {
      res.render('index.html');
    }
  });

  app.get('/instances/new', requireUser, function(req, res, next) {
    res.locals.errors = {};
    res.locals.slug = '';
    res.render('instance_new.html');
  });

  app.post('/instances/new', requireUser, function(req, res, next) {
    var slug = res.locals.slug = req.param('slug', '').trim();
    var Instance = req.popit.model('Instance');
    var Permission = req.popit.permissions();
    var instance = new Instance();
    instance.slug = slug;
    instance.email = req.user.email;
    instance.status = 'active';
    instance.save(function(err, newInstance) {
      if (err) {
        res.locals.errors = err.errors;
        res.locals.existing_instance_url = instance.base_url;
        return res.render('instance_new.html');
      }
      // Make the user owner of the instance
      Permission.create({
        account: req.user._id,
        instance: newInstance._id,
        role: 'owner',
      }, function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/instances/' + slug);
      });
    });
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
