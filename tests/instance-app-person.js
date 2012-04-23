// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils               = require('../lib/utils'),
    selenium_helpers    = require('../lib/testing/selenium'),
    config              = require('config'),
    async               = require('async'),
    $                   = require('jquery');

module.exports = {

    setUp: function (setUp_done) {
        
        utils.delete_all_testing_databases( function () {
            utils.load_test_fixtures( function () {
                selenium_helpers.start_instance_server( function () {                
                    setUp_done();
                });            
            });
        });

    },

    tearDown: function (tearDown_done) {
        selenium_helpers.stop_servers(tearDown_done);
    },

    "Create a new person": function (test) {
    
        var browser = selenium_helpers.new_instance_browser( 'foobar' );
        
        test.expect(2);
        
        browser
            // go to new person page
            .clickAndWait('link=all the people')
            .clickAndWait("link=Create a new person")

            // try to enter an empty name
            .clickAndWait("css=input[type=\"submit\"]")
            .assertTextPresent("required")
            
            // enter a proper name, get sent to person page
            .type("name=name", "Joe Bloggs")
            .clickAndWait("css=input[type=\"submit\"]")
            .assertTextPresent("Joe Bloggs")
            
            // go to the people list
            .open('/')
            .clickAndWait('link=all the people')
            .assertTextPresent("Joe Bloggs")
            .clickAndWait("link=Joe Bloggs")
    
            // all done
            .testComplete()
            .end(function (err) {
                test.ifError(err);
                test.ok(true, "end of tests");
                test.done();
            });        
    },
};

