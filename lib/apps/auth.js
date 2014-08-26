"use strict";

var express                 = require('../express-inherit'),
    current_absolute_url    = require('../middleware/route').current_absolute_url,
    base_url                = require('../middleware/route').base_url,
    passport                = require('../passport'),
    popit                   = require('../popit'),
    legacyAccountUpgrade    = require('../middleware/legacy-account-upgrade');

var app = express();


var capture_common_parameters = function (req,res,next) {

  // If there is a redirect_to param use it to store the destination for
  // post auth
  var redirect_to = req.param('redirect_to');
  if (redirect_to) {
    req.session.post_login_redirect_to = redirect_to;
  }

  res.locals.isUpgrading = typeof req.session.legacyInstanceId === 'string';

  next();
};

module.exports.capture_common_parameters = capture_common_parameters;

app.get('/login', capture_common_parameters, function (req,res) {

  // pass through some of the values
  res.locals.email  = req.param('email');
  res.locals.errors = [];

  res.render('login.html');
});

app.post(
  '/login',

  capture_common_parameters,

  // Intercept legacy account logins and force the user to upgrade to a new
  // site-wide account.
  function(req, res, next) {
    var errors = res.locals.errors = [];
    res.locals.email = req.param('email');

    passport.authenticate('legacy', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next();
      }
      // If we've got this far then the user has logged into a legacy account
      // Check if the user has already upgraded
      var Permission = req.popit.permissions();
      Permission.count({instance: req.popit.instance_id()}, function(err, count) {
        if (err) {
          return next(err);
        }
        if (count === 0) {
          req.session.legacyInstanceId = req.popit.instance_id();
          res.render('legacy-upgrade.html');
        } else {
          errors.push('This legacy account has been upgraded.');
          errors.push('Please login with a site-wide account');
          res.render('login.html');
        }
      });
    })(req, res, next);
  },
  // Get the email and password.
  // check we have both.
  // load the user
  function (req, res, next ) {

    var errors = res.locals.errors = [];
    res.locals.email = req.body.email || '';

    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        errors.push(info.message);
        return res.render('login.html');
      }
      req.login(user, function(err) {
        if (err) {
          return next(err);
        }
        res.locals.user = user;
        next();
      });
    })(req, res, next);
  },

  legacyAccountUpgrade,

  // now logged in, redirect to where we should go
  function(req, res, next) {

    var redirect_to = req.session.post_login_redirect_to || '/';

    delete req.session.post_login_redirect_to;
    res.req.flash('info', 'You are now logged in.');
    res.redirect( redirect_to );
  }

);


app.get('/logout', function (req,res,next) {
  req.session = null;
  res.redirect('/');
});

module.exports.app = app;


module.exports.middleware = function (req,res,next) {

  res.locals.user = req.user;
  req.permission = {};

  if ( req.user ) {
    req.popit.permissions().findOne({ account: req.user._id, instance: req.popit.instance_id() }, function(err, permission) {
      if ( err ) {
        return next(err);
      }
      req.permission = permission;
      next();
    });
  } else {
    next();
  }

};


module.exports.requireUser = function requireUser(req, res, next) {
  // if we have a user then continue
  if ( req.user ) {
      return next();
  }

  // Store our url on the session and get the user to log in.
  req.session.post_login_redirect_to = current_absolute_url(req);
  res.redirect( base_url(req) + '/login' );
};

module.exports.apiRequireUser = function apiRequireUser (req, res, next) {  
  if (req.user) {
    return next();
  }
  passport.authenticate(
    [ 'apitoken', 'basic', 'legacy-basic'],
    { session: false }
  )(req, res, next);
};


app.get('/upgrade', function(req, res) {
  res.render('legacy-upgrade.html');
});
