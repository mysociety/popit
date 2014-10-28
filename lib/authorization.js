"use strict";

var ConnectRoles = require('connect-roles');
var Error401 = require('./errors').Error401;

var authorization = module.exports = new ConnectRoles({
  failureHandler: function(req, res, action) {
    res.format({
      html: function(){
        req.next(new Error401());
      },

      json: function(){
        res.send(401, { message: 'Unauthorized' });
      },

      text: function(){
        res.send(401, { message: 'Unauthorized' });
      }

    });
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
  if (req.permission.role === 'editor' || req.legacyUser) {
    return true;
  }
});

// Instance owners can do everything
authorization.use(function(req) {
  if (req.permission.role === 'owner') {
    return true;
  }
});
