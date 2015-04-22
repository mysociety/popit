"use strict";

var assert = require('assert');
var utils = require('../lib/utils');
var _ = require('underscore');
var async = require('async');

describe("utils", function() {

  it("test_is_email", function() {
    var good = [
      'bob@example.com',
      'fred@thisdomaindoesnotexist.bogus'
    ];

    var bad = [
      'foo',
      'foo@',
      '@example.com',
      '',
      null
    ];

    _.each( good, function ( email ) {
      assert(utils.is_email(email), "is an email: " + email);
    });

    _.each( bad, function ( email ) {
      assert(!utils.is_email(email), "not an email: " + email);
    });
  });

  it("is_ObjectId", function() {
    var tests = {
      '':    false,
      'foo': false,
      '4f99219333fa2efc68000006': true,
      '4F99219333FA2EFC68000006': true,
    };

    _.map( tests, function (value, key) {
      assert(
        utils.is_ObjectId(key) == value,
        "testing '" + key + "' is " + ( value ? 'true' : 'false')
      );
    });
  });

  it("test_password_crypting", function(done) {
    var plaintext = 'secr3t';
    var hashed    = null;

    async.series([
      function(cb) {
        // hash the password, check we get something
        utils.password_hash(
          plaintext,
          function(h) {
            hashed = h;
            assert.notEqual( null     , hashed, "have a password: " + hashed );
            assert.notEqual( plaintext, hashed, "password changed when hashed" );
            cb();
          }
        );
      },
      function(cb) {
        // generate a new hash, check it is different
        utils.password_hash(plaintext, function(new_hash) {
          assert.notEqual(hashed, new_hash, "new salt used");
          cb();
        });
      },
      function(cb) {
        // check that the correct password compares correctly
        utils.password_hash_compare(plaintext, hashed, function(is_same) {
          assert(is_same, "password and hash compare as expected");
          cb();
        });
      },
      function (cb) {
        // check that a wrong password does not match
        utils.password_hash_compare('bogus', hashed, function(is_same) {
          assert(!is_same, "bad password and hash compare as expected");
          cb();
        });
      },
    ], done);
  });

  it("password_and_hash_generate", function(done) {
    utils.password_and_hash_generate(function(plaintext, hash) {
      assert(plaintext, "got plaintext: " + plaintext);
      assert(hash, "got hash: " + hash);

      utils.password_hash_compare(plaintext, hash, function(is_same) {
        assert(is_same, "the two match");
        done();
      });
    });
  });

  it("mongodb_connection_string", function() {
    assert.equal(process.env.NODE_ENV, 'testing', 'running in test mode');

    assert.throws(
      function() { utils.mongodb_connection_string(); },
      /must provide a db name to mongodb_connection_string/,
      "no name leads to exception being thrown"
    );

    assert.equal(
      utils.mongodb_connection_string('test'),
      'mongodb://localhost/popittest_test',
      "instance slug provided"
    );
  });

  it("delete_all_testing_databases", function(done) {
    utils.delete_all_testing_databases(function(){
      assert(true, 'done');
      done();
    });
  });

  it("test instance_base_url_from_slug", function() {
    assert.deepEqual(
      utils.instance_base_url_from_slug('foo'),
      "http://foo.127.0.0.1.xip.io:3100",
      "got correct base url for 'foo'"
    );
  });

});
