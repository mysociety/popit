"use strict";

var express = require('../express-inherit');
var passport = require('../passport');
var capture_common_parameters = require('./auth').capture_common_parameters;
var legacyAccountUpgrade = require('../middleware/legacy-account-upgrade');
var Error404 = require('../errors').Error404;
var format = require('util').format;
var config = require('config');

var app = module.exports = express();

app.locals({
  isUpgrading: false
});

app.use(function(req, res, next) {
  res.locals.userName = req.param('name');
  res.locals.email  = req.param('email');
  res.locals.errors = [];

  next();
});

app.get('/register', capture_common_parameters, function (req, res) {
  res.render('register.html');
});

app.post('/register', capture_common_parameters, function (req, res, next) {
  var Account = req.popit.accounts();
  Account.register({ name: req.body.name, email: req.body.email }, req.body.password, function(err, account) {
    if (err) {
      res.locals.errors = [err.message];
      return res.render('register.html');
    }

    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
      req.login(user, next);
    })(req, res, next);
  });
}, legacyAccountUpgrade, function(req, res, next) {
  res.redirect('/');
});

app.param('inviteCode', function(req, res, next, inviteCode) {
  var Invite = req.popit.master().model('Invite');
  Invite.findOne({ code: inviteCode }).populate('instance').exec(function(err, invite) {
    if (err) {
      return next(err);
    }
    // If there is no invite, 404.
    if (!invite) {
      return next(new Error404());
    }
    req.invite = res.locals.invite = invite;
    next();
  });
});

app.get('/invited/:inviteCode', function(req, res, next) {
  res.render('invited.html');
});

app.post('/invited/:inviteCode', function(req, res, next) {
  var Account = req.popit.accounts();
  Account.register({ name: req.body.name, email: req.body.email }, req.body.password, function(err, account) {
    if (err) {
      res.locals.errors = [err.message];
      return res.render('invited.html');
    }
    var Permission = req.popit.permissions();
    Permission.create({
      account: account.id,
      instance: req.invite.instance.id,
      role: 'editor',
    }, function(err) {
      if (err) {
        return next(err);
      }
      req.invite.remove(function(err) {
        if (err) {
          return next(err);
        }
        passport.authenticate('local', function (err, user, info) {
          if (err) {
            return next(err);
          }
          req.login(user, function(err) {
            if (err) {
              return next(err);
            }
            res.redirect(format(config.instance_server.base_url_format, req.invite.instance.slug));
          });
        })(req, res, next);
      });
    });
  });
});
