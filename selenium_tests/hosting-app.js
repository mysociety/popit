// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils         = require('../lib/utils'),
    new_browser   = require('../lib/testing/browser').new_browser,
    child_process = require('child_process'),
    config        = require('config');



module.exports = {

    setUp: function (cb) {

        // spawn a testing server
        this.app = child_process.spawn(
            'node', [ __dirname + '/../hosting-app/app.js' ]
        );
        
        // forward all errors
        this.app.stderr.on('data', function (data) {
          console.log('stderr: ' + data);
        });
        // this.app.stdout.on('data', function (data) {
        //   console.log('stdout: ' + data);
        // });
        
        
        utils.delete_all_testing_databases( function () {
            // wait for the server to start
            setTimeout( cb, 2000 );
        });

    },

    tearDown: function (cb) {

        // trap the close
        this.app.on( 'exit', function () {cb()} );        
        this.app.kill();
    },

    check_title: function (test) {

        var browser = new_browser( config.server.port );
        
        test.expect(2);
        
        browser
            .waitForTextPresent('Welcome to PopIt')
            .assertTextPresent('Welcome to PopIt')
            .testComplete()
            .end(function (err) {
                test.ifError(err);
                test.ok(true, "end of tests");
                test.done();
            });        
    },
};

