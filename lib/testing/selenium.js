var soda            = require('soda'),
    child_process   = require('child_process'),
    config          = require('config'),
    async           = require('async'),
    _               = require('underscore');

var started_apps = {};

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
        .setTimeout(5000)
        .open('/');
};




module.exports.stop_servers = function ( stop_servers_done ) {

    var stoppers = [];
    
    _.each( started_apps, function ( app, key ) {
        stoppers.push(function(cb) {
            // trap the close
            app.on( 'exit', function () {
                delete started_apps[key];
                cb();
            });        
            app.kill();            
        });
    });
    
    async.parallel(
        stoppers,
        stop_servers_done
    );
    
}



module.exports.start_servers = function (start_servers_done) {
    
    async.parallel(
        [
            start_hosting_app,
            start_instance_app,
        ],
        start_servers_done
    );

};


function start_hosting_app(cb) {
    started_apps.hosting = start_app(
        __dirname + '/../../hosting-app/app.js',
        cb
    );
};

function start_instance_app(cb) {
    started_apps.instance = start_app(
        __dirname + '/../../instance-app/app.js',
        cb
    );
};

function start_app(path_to_app, cb) {

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

