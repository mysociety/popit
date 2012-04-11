var soda            = require('soda'),
    child_process   = require('child_process'),
    config          = require('config'),
    async           = require('async'),
    _               = require('underscore');

var started_servers = {};

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
    
    _.each( started_servers, function ( app, key ) {
        stoppers.push(function(cb) {
            // trap the close
            app.on( 'exit', function () {
                delete started_servers[key];
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
            start_hosting_server,
            start_instance_server,
        ],
        start_servers_done
    );

};


function start_hosting_server(cb) {
    started_servers.hosting = start_server(
        __dirname + '/../../hosting-app/app.js',
        cb
    );
};

function start_instance_server(cb) {
    started_servers.instance = start_server(
        __dirname + '/../../instance-app/app.js',
        cb
    );
};

module.exports.start_instance_server = start_instance_server;
module.exports.start_hosting_server  = start_hosting_server;

function start_server(path_to_server, cb) {

    // console.log( 'starting %s', path_to_server );

    var app = child_process.spawn( 'node', [ path_to_server ] );
    
    // forward all errors
    app.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    app.stdout.on('data', function (data) {
      // console.log('stdout: ' + data);

      var regexp = new RegExp('PopIt .* server listening');
      if ( regexp.test(data)) {
          // console.log('server started: ', path_to_server);
          cb( null );
      }

    });
        
    return app;
};

