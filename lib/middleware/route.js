"use strict"; 

var utils          = require('../utils'),
    winston        = require('winston'),
    url            = require('url');

// Express 2.5.9 handles redirects that start with '/' by homing them at 
// the mounted apps base. Which is wrong. Use full url to avoid this issue.

// not really middleware - should go somewhere more useful...
exports.base_url = function current_absolute_url (req) {
  var host        = req.headers.host;
  var tls         = req.connection.encrypted;
  return 'http' + (tls ? 's' : '') + '://' + host;
};

// not really middleware - should go somewhere more useful...
exports.current_absolute_url = function current_absolute_url (req) {
  return exports.base_url(req) + req.originalUrl;
};

exports.current_absolute_pathname = function current_absolute_pathname (req) {
  return url.parse(req.originalUrl).pathname;
};

exports.requireUser = function requireUser(req, res, next) {
  // if we have a user then continue
  if ( req.user ) return next();

  // Store our url on the session and get the user to log in.
  req.session.post_login_redirect_to = exports.current_absolute_url(req);
  res.redirect( exports.base_url(req) + '/login' );
};


// use Basic Auth
// app.use(
  // module.exports = function basicAuth(callback, realm) {
  //   var username, password;
  // 
  //   // user / pass strings
  //   if ('string' == typeof callback) {
  //     username = callback;
  //     password = realm;
  //     if ('string' != typeof password) throw new Error('password argument required');
  //     realm = arguments[2];
  //     callback = function(user, pass){
  //       return user == username && pass == password;
  //     }
  //   }
  // 
  //   realm = realm || 'Authorization Required';
  // 

function unauthorized (res, realm) {
  res.setHeader('WWW-Authenticate', 'Basic realm="' + realm + '"');
  res.json({error: 'not authenticated'}, 401);
}

// much of this is taken from
// https://github.com/senchalabs/connect/blob/master/lib/middleware/basicAuth.js
exports.apiRequireUser = function apiRequireUser (req, res, next) {  

  var realm = "API";
  
  // If we are already authed then just continue
  if (req.user) return next();

  // If we don't have any auth info then bail out
  var authorization = req.headers.authorization;
  if (!authorization) return unauthorized(res, realm);

  var parts = authorization.split(' '),
      scheme = parts[0],
      credentials = new Buffer(parts[1], 'base64').toString().split(':'),
      username = credentials[0],
      password = credentials[1];

  // winston.verbose({scheme: scheme, username: username, password: password });

  if ('Basic' != scheme) return next(utils.error(400));

  // check the user and pass against the database
  var User = req.popit.model('User');
  
  User.findOne( { email: username }, function (err, user) {
    if (err)   return next(err);
    if (!user) return unauthorized(res, realm);
    
    utils.password_hash_compare(
      password,
      user.hashed_password,
      function(is_same) {
        if (is_same) {
          req.user = user;
          next();
        } else {
          unauthorized(res, realm);
        }
      }
    );
  });
  
};

