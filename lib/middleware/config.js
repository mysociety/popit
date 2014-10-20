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
    },
  });
  next();
};
