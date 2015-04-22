"use strict";

var assert = require('assert');
var utils = require('../lib/utils');
var PopIt = require('../lib/popit');

describe("token", function() {
  var popit;
  var Token;

  beforeEach(function() {
    popit = new PopIt();
    popit.set_instance('test');
    Token = popit.model('Token');
  });

  beforeEach(utils.delete_all_testing_databases);

  it("create token and retrieve", function(done) {
    var token = new Token({
      action: 'log_in_user',
      args: {
        email: 'owner@example.com',
        redirect_to: '/foobar',
      },
    });

    // check that the dates are set
    assert(token.created, 'created');
    assert(token.expires, 'expires');

    // check that expires is as we expect
    var three_days = 3 * 86400 * 1000;
    assert(
      (
        token.expires >= Date.now() + three_days - 1000 &&
        token.expires <= Date.now() + three_days + 1000
      ),
      "expires is in expected range"
    );

    token.save(function(err) {
      assert.ifError(err);

      // check that we can retrieve it
      Token.findValid(token.id, function(err, doc) {
        assert.ifError(err);
        assert.equal(doc.id, token.id, "retrieved token");
        done();
      });
    });
  });

  it("create expiredtoken and retrieve", function(done) {
    var token = new Token({
      expires: Date.now(),
      action: 'log_in_user',
    });

    token.save(function(err) {
      assert.ifError(err);

      // check that we can retrieve it
      Token.findById(token.id, function(err, doc) {
        assert.ifError(err);
        assert.equal(doc.id, token.id, "token in db");

        Token.findValid(token.id, function(err, doc) {
          assert.ifError(err);
          assert.equal(doc, null, "No token returned");

          // test that the token is now deleted
          Token.findById(token.id, function(err,doc) {
            assert.ifError(err);
            assert.equal(doc, null, "No token in db with that id");
            done();
          });
        });
      });
    });
  });

});
