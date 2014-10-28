"use strict";

var config = require('config');
var packageJson = require('../../package.json');

module.exports = function configMiddleware(req, res, next) {
  res.locals({
    config: {
      hosting_site_base_url:         config.hosting_server.base_url,
      instance_site_base_url_suffix: config.instance_server.base_url_format.replace(/^.*%s/, ''),
      show_dev_site_warning:         config.show_dev_site_warning,
      popit_version:                 packageJson.version,
      force_https:                   config.force_https,
    },

    // put in null values here so that the templates can all be consistent, even in
    // the edge cases where an instance has not been loaded, or a user is not logged in.
    user:  null,
    popit: null,
  });
  next();
};
