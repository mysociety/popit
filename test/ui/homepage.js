"use strict";

var assert = require('assert');
var Browser = require('zombie');
var app = require('../../app');
var config = require('config');

Browser.localhost(config.hosting_server.host, config.server.port);

describe("homepage", function() {
  var server;
  var browser = new Browser();

  before(function() {
    server = app.listen(config.server.port);
  });

  before(function(done) {
    browser.visit('/', done);
  });

  it("loads successfully", function() {
    browser.assert.success();
  });

  it("contains link to create new instance", function() {
    browser.assert.link('a', 'Start your own PopIt', '/instances/new');
  });

  it("contains link to all instances", function() {
    browser.assert.link('a', 'Browse existing PopIts', '/instances');
  });

  after(function() {
    server.close();
  });
});
