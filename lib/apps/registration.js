"use strict";

var express = require('../express-inherit');
var passport = require('passport');
var capture_common_parameters = require('./auth').capture_common_parameters;
var legacyAccountUpgrade = require('../middleware/legacy-account-upgrade');

var app = module.exports = express();

app.locals({
  isUpgrading: false
});

app.get('/register', capture_common_parameters, function (req, res) {
  res.locals.email  = req.param('email');
  res.locals.errors = [];

  res.render('register.html');
});

app.post('/register', capture_common_parameters, function (req, res, next) {
  var Account = req.popit.accounts();
  Account.register(new Account({ username : req.body.email }), req.body.password, function(err, account) {
    if (err) {
      res.locals.errors = [err.message];
      return res.render('register.html', { account : account, email: req.body.email });
    }

    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
      req.login(user, function(err) {
        if (err) {
          return next(err);
        }
        next();
      });
    })(req, res, next);
  });
}, legacyAccountUpgrade, function(req, res, next) {
  res.redirect('/');
});
