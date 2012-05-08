var soda            = require('soda'),
    config          = require('config');

module.exports.new_hosting_browser = function ( ) {
    return new_browser( 'http://' + config.hosting_server.domain + '/' );
};

module.exports.new_instance_browser = function ( name ) {
    return new_browser( 'http://' + name + '.' + config.instance_server.domain_suffix + '/' );
};

function new_browser ( url ) {
    
    // console.log( "creating new browser for '" + url + "'" );

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
      .type("name=email", "test@example.com")
      .type("name=password", "secret")
      .clickAndWait("css=input[type=\"submit\"]")
  }
}
