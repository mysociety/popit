"use strict";

var ConnectRoles = require('connect-roles');
var Error404 = require('./errors').Error404;

var authorization = module.exports = new ConnectRoles({
  failureHandler: function(req, res, action) {
    // Show a 404 page if the user doesn't have permission to view it.
    // TODO: Perhaps a 403 error with a permission denied page would be better?
    req.next(new Error404());
  }
});

// Anonymous users can't do anything, return false to stop further rules
// being evaluated.
authorization.use(function(req, action) {
  if (!req.isAuthenticated() || !req.permission) {
    return false;
  }
});

// Role 'editor' can edit instance
authorization.use('edit instance', function(req) {
  if (req.permission.role === 'editor') {
    return true;
  }
});

// Instance owners can do everything
authorization.use(function(req) {
  if (req.permission.role === 'owner') {
    return true;
  }
});
