var config      = require('config'),
    version     = require('version');

// TODO - when using express 3 replace all this with app.locals

/**
 * Config:
 * 
 *   Copy some config across to the res.local so it is available in the templates.
 *
 *     connect()
 *       .use( require('../lib/middleware/config')() )
 *
 */


module.exports = function setup_config_for_templates () {  

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
    };
  });

  return function transfer_config_to_res_local(req, res, next){
    res.local( 'config', config_for_templates );  
    next();  
  };

};
