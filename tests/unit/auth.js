"use strict";

process.env.NODE_ENV = 'testing';

var request = require('supertest');
var app = require('../../app');
var utils = require('../../lib/utils');
var PopIt = require('../../lib/popit');

module.exports = {
  setUp: function(cb) {
    this.popit = new PopIt();
    utils.delete_all_testing_databases(cb);
  },

  tearDown: function(cb) {
    // close the connections so that the test script can exit
    this.popit.close_db_connections(cb);
  },

  "registration page": function(test) {
    test.expect(1);
    request(app)
    .get('/register')
    .set('Host', 'www.127.0.0.1.xip.io')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return test.done(err);
      }
      test.ok(res.text.indexOf("Register") !== -1, "registration page didn't contain 'Register'");
      test.done();
    });
  },

  "registering": function(test) {
    test.expect(1);
    request(app)
    .post('/register')
    .set('Host', 'www.127.0.0.1.xip.io')
    .send({ email: 'bob@example.com', password: 's3cret' })
    .expect(302)
    .end(function(err, res) {
      if (err) {
        return test.done(err);
      }

      test.equal('/', res.headers.location);

      test.done();
    });
  }
};
