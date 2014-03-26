"use strict";

var assert = require('assert');
var utils = require('../lib/utils');
var async = require('async');
var PopIt = require('../lib/popit');

describe("popit settings", function() {
  var foo;
  var bar;

  beforeEach(function(done) {
    // create two popits to test with
    foo = new PopIt();
    foo.set_instance('foo');

    bar = new PopIt();
    bar.set_instance('bar');

    async.series(
      [
        utils.delete_all_testing_databases,
        function (cb) {
          var pop = new PopIt();
          pop.clear_cached_settings();
          cb();
        },
        function (cb) { foo.load_settings(cb); },
        function (cb) { bar.load_settings(cb); },
        function (cb) { foo.set_setting('test_key', 'test_value_foo', cb); },
        function (cb) { bar.set_setting('test_key', 'test_value_bar', cb); },
      ],
      done
    );
  });

  it("test calling 'setting' before 'load_settings' throws error", function() {
    var popit = new PopIt();
    popit.set_instance('pop');

    assert.throws(
      function () { popit.setting('foo'); },
      /Settings not loaded - have you called load_settings?/,
      "can't call 'setting' before 'load_settings'"
    );

    assert.throws(
      function () { popit.set_setting('foo', 'val', function () {} ); },
      /Settings not loaded - have you called load_settings?/,
      "can't call 'set_setting' before 'load_settings'"
    );
  });

  it("test that settings works", function (done) {
    // test a value that does not exist
    assert.equal( foo.setting('should not exist'), null, "missing setting returns null");

    // test values that are saved in setUp
    assert.equal( foo.setting('test_key'), 'test_value_foo', "got correct saved value for foo");
    assert.equal( bar.setting('test_key'), 'test_value_bar', "got correct saved value for bar");

    var new_foo;

    async.series([
      function (cb) {
        // change a setting
        foo.set_setting('test_key','new value', function (err) {
          assert.ifError(err);
          assert( true, "new value saved");
          cb();
        });
      },
      function (cb) {
        // check that the setting has been saved
        assert.equal( foo.setting('test_key'), 'new value', "new value retrieved");
        cb();
      },
      function (cb) {
        // load a new PopIt object and check that the setting is correct
        new_foo = new PopIt();
        new_foo.set_instance('foo');
        new_foo.load_settings( function (err) {
          assert.ifError(err);
          assert.equal( new_foo.setting('test_key'), 'new value', "new value retrieved");
          cb();
        });
      },
      function (cb) {
        // zap the cached settings, reload them and check that the change has persisted
        assert( foo.clear_cached_settings(), "clear cached settings" );
        foo.load_settings(function(err) {
          assert.ifError(err);
          assert.equal( new_foo.setting('test_key'), 'new value', "new value retrieved");
          cb();
        });
      }
    ], done);
  });

  it("test that default settings are used and ignored correctly", function(done) {
    assert.equal(foo.setting('default_test_key'), 'default test value', "default value returned for foo");
    assert.equal(bar.setting('default_test_key'), 'default test value', "default value returned for bar");

    foo.set_setting('default_test_key','new foo value', function (err) {
      assert.ifError(err);
      assert(true, "new value saved");

      assert.equal(foo.setting('default_test_key'), 'new foo value', "new value returned for foo");
      assert.equal(bar.setting('default_test_key'), 'default test value', "default value returned for bar");

      done();
    });
  });

  it("test that guest access is correctly presented", function(done) {
    assert.equal( foo.allow_guest_access(), false, "guest access false by default" );

    foo.set_setting('allow_guest_access', true, function (err) {
      assert.ifError(err);
      assert.equal( foo.allow_guest_access(), true,  "guest access now enabled" );
      done();
    });
  });

});
