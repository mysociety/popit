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
    test.expect(2);
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

      request(app)
      .post('/register')
      .set('Host', 'www.127.0.0.1.xip.io')
      .send({ email: 'bob@example.com', password: 's3cret' })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return test.done(err);
        }

        test.ok(res.text.indexOf('User already exists with name') !== -1, "duplicate emails should not be allowed");

        test.done();
      });
    });
  },
  "login page": function(test) {
    request(app)
    .get('/login')
    .set('Host', 'www.127.0.0.1.xip.io')
    .expect(200)
    .end(function(err, res) {
      if (err) {
        return test.done(err);
      }

      test.ok(res.text.indexOf('Log in') !== -1);

      test.done();
    });
  },
  "login processing": function(test) {
    utils.load_test_fixtures(function() {
      request(app)
      .post('/login')
      .set('Host', 'www.127.0.0.1.xip.io')
      .send({ email: 'bob@example.com', password: 's3cret' })
      .expect(302)
      .end(function(err, res) {
        if (err) {
          return test.done(err);
        }

        test.equal('/instances', res.headers.location);

        test.done();
      });
    });
  },
  "logout": function(test) {
    request(app)
    .get('/logout')
    .set('Host', 'www.127.0.0.1.xip.io')
    .expect(302, test.done);
  }
};
