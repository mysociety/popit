// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils               = require('../../lib/utils'),
    selenium_helpers    = require('../../lib/testing/selenium'),
    test_server_helpers = require('../../lib/testing/server'),
    config              = require('config'),
    async               = require('async'),
    $                   = require('jquery'),
    url                 = require('url');

module.exports = {

    setUp: function (setUp_done) {
        
        utils.delete_all_testing_databases( function () {
            utils.load_test_fixtures( function () {
                test_server_helpers.start_server( function () {                
                    setUp_done();
                });            
            });
        });

    },

    tearDown: function (tearDown_done) {
        test_server_helpers.stop_server(tearDown_done);
    },

    "Test migration page navigation sequence": function (test) {
    
        var browser = selenium_helpers.new_instance_browser( 'foobar' );
        
        test.expect(2);
        
        browser
            // go to migration page
            .clickAndWait("link=Import data automatically")
            .clickAndWait("css=a#migration_tool")
            
            // check that we are at the login page
            .assertTitle('Welcome back')
            .and(selenium_helpers.login())
            .assertTitle('Migration Tool')
            .assertTextPresent('Source file')
                
            // all done
            .testComplete()
            .end(function (err) {
                test.ifError(err);
                test.ok(true, "end of tests");
                test.done();
            });        
    },

    "Test migration page": function (test) {
    
        var browser = selenium_helpers.new_instance_browser( 'foobar' );
        
        test.expect(2);
        
        browser
            // go to migration page
            .open("/migration")

            .and(selenium_helpers.login())
            .assertTitle('Migration Tool')

            // try to enter an empty name
            .clickAndWait("css=input[type=\"submit\"]")
            .assertTextPresent("Source file")
                
            // all done
            .testComplete()
            .end(function (err) {
                test.ifError(err);
                test.ok(true, "end of tests");
                test.done();
            });        
    }
};

