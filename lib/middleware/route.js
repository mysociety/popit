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
