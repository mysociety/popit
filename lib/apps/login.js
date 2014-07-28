"use strict";

var express = require('../express-inherit');
var passport = require('../passport');
var mailer = require('../mailer');
var config = require('config');

var app = module.exports = express();

app.get('/login', function(req, res, next) {
  res.locals.email = req.param('email');
  res.locals.errors = [];

  res.render('login.html');
});

app.post('/login', function(req, res, next) {
  var errors = res.locals.errors = [];
  res.locals.email = req.param('email') || '';

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

      var redirect_to = req.session.post_login_redirect_to || '/instances';
      delete req.session.post_login_redirect_to;
      req.flash('info', 'You are now logged in.');
      res.redirect(redirect_to);
    });
  })(req, res, next);
});

app.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

app.use('/password-reset', function(req, res, next) {
  res.locals.email = req.param('email');
  res.locals.errors = [];
  next();
});

app.get('/password-reset', function(req, res, next) {
  res.render('password-reset.html');
});

app.post('/password-reset', function(req, res, next) {
  var Account = req.popit.accounts();
  Account.findOne({ email: req.param('email') }, function(err, account) {
    if (err) {
      return next(err);
    }
    if (!account) {
      res.locals.errors.push("Can't find that email, sorry.");
      return res.render('password-reset.html');
    }
    // Found an account, set reset code and send email
    account.setResetPasswordToken(function(err, token) {
      if (err) {
        return next(err);
      }

      res.render('password-reset-email.txt', {
        password_reset_link: config.hosting_server.base_url + '/password-reset/' + token,
      }, function(err, message) {
        if (err) {
          return next(err);
        }
        mailer.send(req, {
          to: account.email,
          subject: '[PopIt] Please reset your password',
          text: message,
        });

        res.render('password-reset-sent.html');
      });
    });
  });
});

app.param('resetPasswordToken', function(req, res, next, token) {
  res.locals.token = token;
  var Account = req.popit.accounts();
  Account.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  }, function(err, account) {
    if (err) {
      return next(err);
    }
    if (!account) {
      req.flash('info', 'Password reset token is invalid or has expired.');
      return res.redirect('/password-reset');
    }
    req.account = res.locals.account = account;
    next();
  });
});

app.get('/password-reset/:resetPasswordToken', function(req, res, next) {
  res.render('password-reset-form.html');
});

app.post('/password-reset/:resetPasswordToken', function(req, res, next) {
  if (req.body.password !== req.body.password_confirmation) {
    res.locals.errors.push("Passwords don't match");
    return res.render('password-reset-form.html');
  }
  req.account.setPassword(req.body.password, function(err) {
    if (err) {
      res.locals.errors.push(err.message);
      return res.render('password-reset-form.html');
    }
    req.account.resetPasswordToken = null;
    req.account.resetPasswordExpires = null;
    req.account.save(function(err) {
      if (err) {
        return next(err);
      }
      req.login(req.account, function(err) {
        if (err) {
          return next(err);
        }
        req.flash('info', "Success! Your password has been changed");
        res.redirect('/');
      });
    });
  });
});
