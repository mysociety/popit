// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils           = require('../lib/utils'),
    browser_helpers = require('../lib/testing/browser'),
    config          = require('config'),
    async           = require('async');



module.exports = {

    setUp: function (setUp_done) {
        var self = this;

        async.auto({
            start_hosting_app: function (callback) {
                self.hosting_app = browser_helpers.start_hosting_app(callback);
            },
            start_instance_app: function (callback) {
                self.instance_app = browser_helpers.start_instance_app(callback);
            },
            delete_all_testing_databases: function (callback) {
                utils.delete_all_testing_databases( callback );                
            },
            all_done: [
                'start_hosting_app',
                'start_instance_app',
                'delete_all_testing_databases',
                function (cb) {
                    setUp_done(null);
                    cb(null);
                }
            ],
        });
    },

    tearDown: function (tearDown_done) {
        var self = this;
    
        async.auto({
            stop_hosting_app: function (callback) {
                browser_helpers.stop_app( self.hosting_app, callback);
            },
            stop_instance_app: function (callback) {
                browser_helpers.stop_app( self.instance_app, callback);
            },
            all_done: [
                'stop_hosting_app',
                'stop_instance_app',
                function (cb) {
                    tearDown_done(null);
                    cb(null);
                }
            ],
        });
    },
    
    check_title: function (test) {

        var browser = browser_helpers.new_hosting_browser();
        
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
    
    
        var browser = browser_helpers.new_hosting_browser();
        
        test.expect(1);
    
        browser
    
            // go to the create a new instance page
            .clickAndWait("link=Create a new instance")
    
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
            .clickAndWait("link=Create an instance")
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
            .assertTextPresent( 'Should redirect you to http://foobar.popitdomain.org')
            
            // all done
            .testComplete()
            .end(function (err) {
                if (err) throw err;
                test.ok(true, 'all tests passed');
                test.done();
            });
    
    },
    
};

