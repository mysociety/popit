"use strict";

var requireUser = require('../../lib/apps/auth').requireUser;
var format = require('util').format;
var config = require('config');
var Error404 = require('../../lib/errors').Error404;

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

  app.get('/instances', function(req, res, next){
    req.popit.model('Instance').find({status: 'active'}, function(err, docs) {
      if (err) {
        return next(err);
      }

      res.locals.instances = docs;
      res.render('instances.html');
    });
  });

  // Throw a 404 error
  app.all('/*', function(req, res, next) {
    next(new Error404());
  });
};
