// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils               = require('../../lib/utils'),
    selenium_helpers    = require('../../lib/testing/selenium'),
    test_server_helpers = require('../../lib/testing/server'),
    config              = require('config'),
    async               = require('async'),
    $                   = require('jquery');

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
    
    "Check that non existent site gives correct error": function (test) {
    
        var browser = selenium_helpers.new_instance_browser( 'does-not-exist' );
        
        test.expect(2);
        
        browser
            // on home page
            .assertTextPresent('Site not found')
    
            // on any arbitrary page
            .open('/foo/bar/baz/bundy')
            .assertTextPresent('Site not found')
    
            // all done
            .testComplete()
            .end(function (err) {
                test.ifError(err);
                test.ok(true, "end of tests");
                test.done();
            });        
    },
    
    
    "Check that existing site loads as expected": function (test) {
    
        var browser = selenium_helpers.new_instance_browser( 'foobar' );
        
        test.expect(3);
        
        browser
            // .assertTextPresent('Welcome to PopIt')
            .assertTextPresent('People')
    
            .getHtmlSource(function (html) {
                test.equal(
                    $(html).find("#popit_instance_name").text(),
                    'foobar',
                    "correct instance loaded"
                );
            })
    
            // all done
            .testComplete()
            .end(function (err) {
                test.ifError(err);
                test.ok(true, "end of tests");
                test.done();
            });        
    },
    
    "Test login and logout": function (test) {

        var browser = selenium_helpers.new_instance_browser( 'foobar' );
        
        test.expect(2);
        
        browser
            // .setSpeed(1000)
            // .assertTextPresent('Welcome to PopIt')
            .assertTextPresent('People')
            .clickAndWait("link=Sign In")
            .clickAndWait("css=input[type=\"submit\"]")
            .assertTextPresent("Missing login")

            .type("name=email", "foo")
            .clickAndWait("css=input[type=\"submit\"]")
            .assertTextPresent("Missing password")
            
            .type("name=password", "bad")
            .clickAndWait("css=input[type=\"submit\"]")
            .assertTextPresent("credentials wrong")
            
            .type("name=email", "")
            .type("name=password", "bad")
            .clickAndWait("css=input[type=\"submit\"]")
            .assertTextPresent("Missing login")
            
            .type("name=email", "test@example.com")
            .type("name=password", "secret")
            .clickAndWait("css=input[type=\"submit\"]")
            .assertTextPresent("Sign Out")

            .clickAndWait("link=Sign Out")
            .assertTextPresent("Sign In")
            
            // all done
            .testComplete()
            .end(function (err) {
                test.ifError(err);
                test.ok(true, "end of tests");
                test.done();
            });        
    },
    
    
    
};

