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

        var browser = new_browser( config.hosting_server.port );
        
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

        var browser = new_browser( config.hosting_server.port );
        
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

            // all done
            .testComplete()
            .end(function (err) {
                if (err) throw err;
                test.ok(true, 'all tests passed');
                test.done();
            });

    },
    
};

