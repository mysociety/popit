"use strict";

var assert = require('assert');
var Browser = require('zombie');
var app = require('../../app');
var config = require('config');

Browser.localhost(config.hosting_server.host, config.server.port);

describe("basic headless test", function() {
  this.timeout(5000);
  var server, browser;

  before(function() {
    server = app.listen(config.server.port);
  });

  after(function() {
    server.close();
  });

  beforeEach(function() {
    browser = new Browser();
  });

  it("loads front page", function(done) {
    browser.visit('/', function() {
      assert(
        browser.text(".hosting-app-welcome h1.text-center") === "Welcome to PopIt",
        "welcome text present"
      );
      done();
    });
  });
});
