"use strict";

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var utils = require('./utils');

module.exports = passport;

// Site-wide account authenticator
function authCallback(req, username, password, done) {
  var Account = req.popit.accounts();
  Account.findByUsername(username, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Invalid email or password' });
    }
    user.authenticate(password, done);
  });
}

// Legacy per-instance user authenticator
function legacyAuthCallback(req, username, password, done) {
  var User = req.popit.model('User');
  User.findOne({ email: username }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Invalid email or password' });
    }
    utils.password_hash_compare(password, user.hashed_password, function(valid) {
      if (!valid) {
        return done(null, false, { message: 'Invalid email or password' });
      }
      done(null, user);
    });
  });
}

// Site-wide UI logins
passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, authCallback));

// Legacy per-instance UI logins
passport.use('legacy', new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, legacyAuthCallback));

// Site-wide basic auth
passport.use('basic', new BasicStrategy({
  passReqToCallback: true
}, authCallback));

// Legacy per-instance basic auth
passport.use('legacy-basic', new BasicStrategy({
  passReqToCallback: true
}, legacyAuthCallback));

// Serialize account for session storage
passport.serializeUser(function(account, done) {
  done(null, account.id);
});

// Deserialize account from session
passport.deserializeUser(function(req, id, done) {
  req.popit.accounts().findById(id, done);
});
