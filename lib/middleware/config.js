"use strict"; 

var config    = require('config'),
    version   = require('version');

module.exports = (function () {

  var config_for_templates = {
    hosting_site_base_url:         config.hosting_server.base_url,
    instance_site_base_url_suffix: config.instance_server.base_url_format.replace(/^.*%s/, ''),
    show_dev_site_warning:         config.show_dev_site_warning,
    popit_version:                 null,
  };

  // Get the version number and add it to the config
  version.fetch(function(error, version) {
    if (error) {
      console.error(error);
    } else {
      config_for_templates.popit_version = version;
    }
  });

  return { config: config_for_templates };
})();

