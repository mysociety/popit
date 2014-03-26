"use strict";

var assert = require('assert');
var utils = require('../lib/utils');
var PopIt = require('../lib/popit');
var config = require('config');

describe("popit", function() {
  var popit;

  beforeEach(function() {
    popit = new PopIt();
  });

  beforeEach(utils.delete_all_testing_databases);

  it("sets master instance", function() {
    assert.equal(popit._instance_name, null, "no instance set");
    assert(!popit.is_master(), "not master");

    popit.set_as_master();

    assert.equal(popit._instance_name, config.MongoDB.master_name, "master instance set");
    assert(popit.is_master(), "is master");
  });

  it("gets an instance specific database", function() {
    // check that if we have not set the instance we get an error
    assert.throws(
      function() { popit.instance_db(); },
      'foo',
      'throw exception if instance not configured'
    );

    assert(popit.set_instance( 'test' ), 'set the instance');
    assert(!popit.is_master(), "not master");

    assert(popit.instance_db(), "got a connection to the test instance");
  });

  it("check that we can get a model", function(done) {
    popit.set_instance('test');

    assert.throws(
      function() { popit.model('does_not_exist'); },
      /Could not find a schema for does_not_exist/,
      "throw error for non-existent schema"
    );

    var UserModel = popit.model('User');
    assert(UserModel, "got a model for User");

    assert.strictEqual( popit.model('User'), UserModel, "get a cached model" );

    var user = new UserModel({
      email: "bob@example.com",
      hashed_password: "secret_hash",
    });

    assert(user, "have a user");

    user.save(function(err, object) {

      // check that the user was saved
      assert.ifError(err, "no error saving");
      assert(object);
      assert.equal(object.id, user.id, "IDs are the same");

      UserModel.findOne({email: user.email}, function(err, retrieved_user) {
        assert.ifError(err, "no error retrieving");
        assert(retrieved_user, "Found user in database");
        done();
      });
    });
  });

});
