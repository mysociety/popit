var soda = require('soda');

module.exports.new_browser = function ( test ) {

    // nodeunit thinks we're a test - pander to it
    if ( test ) {
        test.expect(1);
        test.ok( true, "there there dear");
        test.done();
        return null;
    }
    
    var browser = soda.createClient({
        url:  'http://localhost:3000/',
        host: 'localhost',
        port: 4444,
    });

    return browser
        .chain
        .session()
        .setTimeout(5000)
        .open('/');
}