"use strict";

process.env.NODE_ENV = 'testing';

var supertest = require('supertest');
var app = require('../app');
var utils = require('../lib/utils');
var PopIt = require('../lib/popit');
var assert = require('assert');

var request = supertest(app);

describe("auth", function() {
  var popit = new PopIt();
  beforeEach(utils.delete_all_testing_databases);

  it("has a registration page", function(done) {
    request
    .get('/register')
    .set('Host', 'www.127.0.0.1.xip.io')
    .expect(200)
    .expect(/Register/, done);
  });

  it("allows registering", function(done) {
    request
    .post('/register')
    .set('Host', 'www.127.0.0.1.xip.io')
    .send({ name: 'Bob', email: 'bob@example.com', password: 's3cret' })
    .expect(302)
    .expect('Location', '/instances/new')
    .end(function(err, res) {
      assert.ifError(err);
      request
      .post('/register')
      .set('Host', 'www.127.0.0.1.xip.io')
      .send({ name: 'Bob', email: 'bob@example.com', password: 's3cret' })
      .expect(200)
      .expect(/User already exists with name/, done);
    });
  });

  it("has a login page", function(done) {
    request
    .get('/login')
    .set('Host', 'www.127.0.0.1.xip.io')
    .expect(200)
    .expect(/Log in/, done);
  });

  it("processes the login", function(done) {
    utils.load_test_fixtures(function() {
      request
      .post('/login')
      .set('Host', 'www.127.0.0.1.xip.io')
      .send({ email: 'bob@example.com', password: 's3cret' })
      .expect(302)
      .expect('Location', '/instances', done);
    });
  });

  it("allows logout", function(done) {
    request
    .get('/logout')
    .set('Host', 'www.127.0.0.1.xip.io')
    .expect(302, done);
  });

});
