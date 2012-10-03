var soda            = require('soda'),
    config          = require('config'),
    winston         = require('winston'),
    utils           = require('../utils');

module.exports.new_hosting_browser = function ( ) {
    return new_browser( config.hosting_server.base_url );
};

module.exports.new_instance_browser = function ( name ) {
    var url = utils.instance_base_url_from_slug(name);
    return new_browser( url );
};

function new_browser ( url ) {
    
    // winston.verbose( "creating new browser for '" + url + "'" );

    var options = {
        url:  url,
        host: 'localhost',
        port: 4444,
    };
    
    var browser = soda.createClient( options );

    return browser
        .chain
        .session()
        .setTimeout(15000)
        .open('/');
};


module.exports.login = function login() {
  return function(browser) {
    browser
      .open('/login')
      .type("name=email", "owner@example.com")
      .type("name=password", "secret")
      .clickAndWait("css=input[type=\"submit\"]")
  }
}
