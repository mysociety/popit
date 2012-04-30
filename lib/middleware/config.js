var config      = require('config');

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
    hosting_site_base_url: "http://" + config.hosting_server.domain,
  };
  
  return function transfer_config_to_res_local(req, res, next){
    res.local( 'config', config_for_templates );  
    next();  
  };

};
