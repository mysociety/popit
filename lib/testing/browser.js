var soda            = require('soda'),
    child_process   = require('child_process'),
    config          = require('config');

module.exports.new_hosting_browser = function ( ) {
    return new_browser( 'http://' + config.hosting_server.domain + '/' );
};

module.exports.new_instance_browser = function ( name ) {
    return new_browser( 'http://' + name + '.' + config.instance_server.domain_suffix + '/' );
};

var new_browser = module.exports.new_browser = function ( url ) {
    
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
        .setTimeout(5000)
        .open('/');
};

module.exports.stop_app = function ( app, cb ) {
    // trap the close
    app.on( 'exit', function () { cb(); } );        
    app.kill();
}

var start_app = module.exports.start_app = function (path_to_app, cb) {

    // console.log( 'starting %s', path_to_app );

    var app = child_process.spawn( 'node', [ path_to_app ] );
    
    // forward all errors
    app.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    app.stdout.on('data', function (data) {
      // console.log('stdout: ' + data);

      var regexp = new RegExp('PopIt .* server listening');
      if ( regexp.test(data)) {
          // console.log('server started: ', path_to_app);
          cb( null );
      }

    });
        
    return app;
};

module.exports.start_hosting_app = function (cb) {
    return start_app(
        __dirname + '/../../hosting-app/app.js',
        cb
    );
};
module.exports.start_instance_app = function (cb) {
    return start_app(
        __dirname + '/../../instance-app/app.js',
        cb
    );
};
