"use strict";

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalApiKeyStrategy = require('passport-localapikey-update').Strategy;
var utils = require('./utils');
var PopIt = require('./popit');

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
      // we use this for API auth
      req.legacyUser = true;
      done(null, user);
    });
  });
}

function tokenAuthCallback(req, token, done) {
    delete req.body.apikey;
    var Account = req.popit.accounts();
    Account.findOne({apikey: token}, function (err, account) {
      if (err) {
          return done(err);
      }
      if (!account) {
          return done(null, false);
      }
      var Permission = req.popit.permissions();
      Permission.findOne({account: account.id, instance: req.popit.instance_id()}, function(err, permission) {
        if (permission) {
          req.permission = permission;
          return done(null, permission, account);
        }
        return done(null, false);
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

passport.use('apitoken', new LocalApiKeyStrategy({
  passReqToCallback: true
}, tokenAuthCallback));

// Serialize account for session storage
passport.serializeUser(function(account, done) {
  done(null, account.id);
});

// Deserialize account from session
passport.deserializeUser(function(req, id, done) {
  var popit = new PopIt();
  popit.set_as_master();
  popit.model('Account').findById(id, done);
});
