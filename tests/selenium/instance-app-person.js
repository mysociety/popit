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

    "Create a new person": function (test) {
    
        var browser = selenium_helpers.new_instance_browser( 'foobar' );
        
        test.expect(3);
        
        browser
            // go to new person page
            // .clickAndWait('link=all the people')

            // Check that we can't see the create new link
            .assertNotVisible("link=Create a new person")

            // login
            .clickAndWait("link=Sign In")        
            
            // check that we are at the login page
            .assertTitle('Welcome back')
            .and(selenium_helpers.login())
            .assertVisible("link=Create a new person")

            // try to enter an empty name
            .click("link=Create a new person")
            .click("css=input[type=\"submit\"]")
            .assertTextPresent("Required")
            
            // enter a proper name, get sent to person page
            .type("name=name", "Joe Bloggs")
            .clickAndWait("css=input[type=\"submit\"]")
            .assertTitle("Joe Bloggs")
            
            // edit the person
            .clickAndWait('link=+ add a summary of this person')
            .type("name=summary", "Test Summary blah blah")
            .clickAndWait("css=input[type=\"submit\"]")
            .assertTitle("Joe Bloggs")
            .assertTextPresent("Test Summary blah blah")
    
            // go to the people list
            .open('/')
            // .clickAndWait('link=all the people')
            .assertTextPresent("Joe Bloggs")
            .clickAndWait("link=Joe Bloggs")
            
            // create another person with the same slug
            .open('/')
            // .clickAndWait('link=all the people')
            .click("link=Create a new person")            
            .type("name=name", "Joé Bloggs")
            .clickAndWait("css=input[type=\"submit\"]")
            .assertTitle("Joé Bloggs")
            .getLocation( function (loc) {
                test.equal(
                  url.parse(loc).pathname,
                  '/person/joe-bloggs-1',
                  "loc is /person/joe-bloggs-1"
                );
            })
            

            // add a person with an unsluggable name
            .open('/')
            // .clickAndWait('link=all the people')
            .click("link=Create a new person")            
            .type("name=name", "网页")
            .click("css=input[type=\"submit\"]")
            .assertTextPresent("required")
            .type("name=slug", "chinese-name")
            .clickAndWait("css=input[type=\"submit\"]")
            .assertTitle("网页")
    
            // all done
            .testComplete()
            .end(function (err) {
                test.ifError(err);
                test.ok(true, "end of tests");
                test.done();
            });        
    },
};

