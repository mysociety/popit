"use strict";

var config = require('config');
var packageJson = require('../../package.json');

module.exports = function configMiddleware(req, res, next) {
  res.locals({
    config: config,
    popit_version: packageJson.version,

    // put in null values here so that the templates can all be consistent, even in
    // the edge cases where an instance has not been loaded, or a user is not logged in.
    user:  null,
    popit: null,
  });
  next();
};
