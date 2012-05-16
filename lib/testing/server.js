var child_process   = require('child_process'),
    config          = require('config'),
    async           = require('async'),
    _               = require('underscore');

var started_server = null;


module.exports.stop_server = function ( stop_server_done ) {

  if (! started_server) return stop_server_done();

  started_server.on( 'exit', function () {
      started_server = null;
      stop_server_done();
  });        
  started_server.kill();            
}


module.exports.start_server = function (start_server_done) {
  started_server = _start_server(
      __dirname + '/../../server.js',
      start_server_done
  );
};

function _start_server(path_to_server, cb) {

    // console.log( 'starting %s', path_to_server );

    var app = child_process.spawn( 'node', [ path_to_server ] );
    
    // forward all errors
    app.stderr.on('data', function (data) {
      console.log('stderr: ' + data);

      if ( /Error: listen EADDRINUSE/.test(data) ) {
          console.log(
              "\n",
              "************************************************************\n",
              "** NOTE - got 'Error: listen EADDRINUSE' error            **\n",
              "** most likely this means that a test server is running   **\n",
              "**  - try `killall node` to get rid of it                 **\n",
              "************************************************************\n"
          );
          process.exit(1);
      }
      
    });

    var server_has_started = false;

    app.stdout.on('data', function (data) {
      if (server_has_started) 
        console.log('stdout: ' + data);

      var regexp = new RegExp('PopIt hosting and instance apps started');
      if ( !server_has_started && regexp.test(data)) {
        server_has_started = true;
        cb( null );
      }

    });
        
    return app;
};

