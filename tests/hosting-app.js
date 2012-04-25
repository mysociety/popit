// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils               = require('../lib/utils'),
    selenium_helpers    = require('../lib/testing/selenium'),
    config              = require('config'),
    async               = require('async');



module.exports = {

    setUp: function (setUp_done) {
        
        utils.delete_all_testing_databases( function () {
            selenium_helpers.start_servers( function () {
                setUp_done();
            });            
        });
    },

    tearDown: function (tearDown_done) {
        selenium_helpers.stop_servers(tearDown_done);
    },
    
    check_title: function (test) {

        var browser = selenium_helpers.new_hosting_browser();
        
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
    
    create_instance: function (test) {
    
    
        var browser = selenium_helpers.new_hosting_browser();
        
        test.expect(2);
    
        browser
    
            // go to the create a new instance page
            .clickAndWait("link=Create your PopIt site")
    
            // submit the form check that both fields error
            .clickAndWait("css=input.btn.btn-primary")
            .assertTextPresent("Error is 'regexp'.")
            .assertTextPresent("Error is 'required'.")
    
    
            // .getHtmlSource(function (html) {
            //     console.log(html);
            // })
    
            // too short slug
            .type("id=slug", "foo")
            .clickAndWait("css=input.btn.btn-primary")
            .assertTextPresent("Error is 'regexp'.")
    
            // good slug
            .type("id=slug", "foobar")
            .clickAndWait("css=input.btn.btn-primary")
    
            // bad email
            .type("id=email", "bob")
            .clickAndWait("css=input.btn.btn-primary")
            .assertTextPresent("Error is 'not_an_email'.")
    
            // good details
            .type("id=email", "bob@example.com")
            .clickAndWait("css=input.btn.btn-primary")
            .assertTextPresent("This site has been reserved but not created yet.")
    
            // check that the site is now reserved
            .open('/')
            .clickAndWait("link=Create your PopIt site")
            .type("id=slug", "foobar")
            .clickAndWait("css=input.btn.btn-primary")
            .assertTextPresent("Error is 'slug_not_unique'.")
    
            // check that the instance page works
            .open("/instance/foobar")
            
            // go to the last email page
            .open("/_testing/last_email")
            .clickAndWait("css=a")
    
            // on the confirm app page
            .assertTextPresent( 'Please click the button below to create your site!')
            .clickAndWait("css=input[type=submit]")
    
            // .setSpeed( 10000 )
            .getLocation( function (loc) {
                test.ok( /http:\/\/foobar\./.test(loc), "loc contains http://foobar." );
            })
            .assertTextPresent( 'Welcome to foobar')
            
            // all done
            .testComplete()
            .end(function (err) {
                if (err) throw err;
                test.ok(true, 'all tests passed');
                test.done();
            });
    
    },
    
};

