"use strict";

var assert = require('assert');
var utils = require('../lib/utils');
var PopIt = require('../lib/popit');

describe("membership", function() {
  var popit;

  beforeEach(function() {
    popit = new PopIt();
    popit.set_instance('test');
  });

  beforeEach(utils.delete_all_testing_databases);
  beforeEach(utils.load_test_fixtures);

  it("gets memberships from person (with cb)", function (done) {
    popit.model('Person').findOne({_id: 'barack-obama'}, function(err, obama) {
      assert.ifError(err);

      assert.equal(obama.name, "Barack Obama", "Got Obama");

      obama.find_memberships(function(err, memberships) {
        assert.ifError(err);
        assert.equal(memberships.length, 1, "count memberships");
        assert.equal(memberships[0].role, "President", "is president");
        done();
      });
    });
  });

  it("gets memberships from person (without cb)", function (done) {
    popit.model('Person').findOne({_id: 'barack-obama'}, function(err, obama) {
      assert.ifError(err);
      assert.equal(obama.name, "Barack Obama", "Got Obama");

      var memberships = obama.find_memberships();

      memberships.exec(function(err, memberships) {
        assert.ifError(err);

        assert.equal(memberships.length, 1, "count memberships");
        assert.equal(memberships[0].role, "President", "is president");
        done();
      });
    });
  });

  it("gets memberships from organization", function (done) {
    popit.model('Organization').findOne({_id: 'united-states-government'}, function(err, usg) {
      assert.ifError(err);
      assert.equal(usg.name, "United States Government", "Got USG");

      usg.find_memberships(function(err, memberships) {
        assert.ifError(err);
        assert.equal(memberships.length, 4, "count memberships");
        done();
      });
    });
  });

});
