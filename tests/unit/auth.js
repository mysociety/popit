"use strict";

process.env.NODE_ENV = 'testing';

var supertest = require('supertest');
var app = require('../../app');
var utils = require('../../lib/utils');
var PopIt = require('../../lib/popit');

var request = supertest(app);

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
    request
    .get('/register')
    .set('Host', 'www.127.0.0.1.xip.io')
    .expect(200)
    .expect(/Register/, test.done);
  },

  "registering": function(test) {
    request
    .post('/register')
    .set('Host', 'www.127.0.0.1.xip.io')
    .send({ name: 'Bob', email: 'bob@example.com', password: 's3cret' })
    .expect(302)
    .expect('Location', '/instances/new')
    .end(function(err, res) {
      if (err) {
        return test.done(err);
      }

      request
      .post('/register')
      .set('Host', 'www.127.0.0.1.xip.io')
      .send({ name: 'Bob', email: 'bob@example.com', password: 's3cret' })
      .expect(200)
      .expect(/User already exists with name/, test.done);
    });
  },

  "login page": function(test) {
    request
    .get('/login')
    .set('Host', 'www.127.0.0.1.xip.io')
    .expect(200)
    .expect(/Log in/, test.done);
  },

  "login processing": function(test) {
    utils.load_test_fixtures(function() {
      request
      .post('/login')
      .set('Host', 'www.127.0.0.1.xip.io')
      .send({ email: 'bob@example.com', password: 's3cret' })
      .expect(302)
      .expect('Location', '/instances', test.done);
    });
  },

  "logout": function(test) {
    request
    .get('/logout')
    .set('Host', 'www.127.0.0.1.xip.io')
    .expect(302, test.done);
  },

};
