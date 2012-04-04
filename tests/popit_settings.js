// Test that settings are correctly stored and retrieved, and that settings do not
// leak from one instance to another.


// switch to testing mode
process.env.NODE_ENV = 'testing';

var 
    utils    = require('../lib/utils'),
    // config   = require('config'),
    // _        = require('underscore'),
    async    = require('async')
    PopIt    = require('../lib/popit');

module.exports = {
    
    setUp: function(cb) {

        // create two popits to test with
        var foo = this.foo = new PopIt();
        foo.set_instance('foo');

        var bar = this.bar = new PopIt();
        bar.set_instance('bar');

        async.series(
            [
                utils.delete_all_testing_databases,
                function (cb) {
                    var pop = new PopIt();
                    pop.clear_cached_settings();
                    cb();
                },
                function (cb) { foo.load_settings(cb) },
                function (cb) { bar.load_settings(cb) },
                function (cb) { foo.set_setting('test_key', 'test_value_foo', cb) },
                function (cb) { bar.set_setting('test_key', 'test_value_bar', cb) },
            ],

            // optional callback
            cb
        );        
    },
    
    tearDown: function(cb) {
        // cose the connections so that the test script can exit
        var p = new PopIt();
        p.close_db_connections();
        cb(null);
    },
    
    "test calling 'setting' before 'load_settings' throws error": function ( test ) {    
        test.expect(1);

        var pop = new PopIt();
        pop.set_instance('pop');

        test.throws(
            function () {pop.setting('foo')},
            /Settings not loaded - have you called load_settings?/,
            "can't call 'setting' before 'load_settings'"
        );

        test.done();
    },

    "test that settings works": function (test) {
        var foo = this.foo;
        var bar = this.bar;
        
        test.expect(11);
        
        // test a value that does not exist
        test.equal( foo.setting('should not exist'), null, "missing setting returns null");

        // test values that are saved in setUp
        test.equal( foo.setting('test_key'), 'test_value_foo', "got correct saved value for foo");
        test.equal( bar.setting('test_key'), 'test_value_bar', "got correct saved value for bar");

        async.series([
            function (cb) {
                // change a setting
                foo.set_setting('test_key','new value', function (err) {
                    test.ifError(err);
                    test.ok( true, "new value saved");
                    cb();
                });
            },
            function (cb) {
                // check that the setting has been saved
                test.equal( foo.setting('test_key'), 'new value', "new value retrieved");
                cb();
            },
            function (cb) {
                // load a new PopIt object and check that the setting is correct
                new_foo = new PopIt();
                new_foo.set_instance('foo');
                new_foo.load_settings( function (err) {
                    test.ifError(err);
                    test.equal( new_foo.setting('test_key'), 'new value', "new value retrieved");
                    cb();
                });
            },
            function (cb) {
                // zap the cached settings, reload them and check that the change has persisted
                test.ok( foo.clear_cached_settings(), "clear cached settings" );
                foo.load_settings(function(err) {
                    test.ifError(err);
                    test.equal( new_foo.setting('test_key'), 'new value', "new value retrieved");
                    cb();
                });
            }        
        ],
        function() {
            test.done()
        });
    },
    
    "test that default settings are used and ignored correctly": function (test) {
        test.expect(6);
        
        var foo = this.foo;
        var bar = this.bar;
        
        test.equal( foo.setting('default_test_key'), 'default test value', "default value returned for foo");
        test.equal( bar.setting('default_test_key'), 'default test value', "default value returned for bar");

        foo.set_setting('default_test_key','new foo value', function (err) {
            test.ifError(err);
            test.ok( true, "new value saved");

            test.equal( foo.setting('default_test_key'), 'new foo value', "new value returned for foo");
            test.equal( bar.setting('default_test_key'), 'default test value', "default value returned for bar");

            test.done();
        });
    },

};