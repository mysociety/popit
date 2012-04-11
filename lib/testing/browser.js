var soda = require('soda');

module.exports.new_browser = function ( app_port ) {
    
    var options = {
        url:  'http://localhost:' + app_port + '/',
        host: 'localhost',
        port: 4444,
    };
    
    var browser = soda.createClient( options );

    return browser
        .chain
        .session()
        .setTimeout(5000)
        .open('/');

};
