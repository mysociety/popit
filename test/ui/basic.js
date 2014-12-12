"use strict";

var assert = require('assert');
var Browser = require('zombie');
var app = require('../../app');

describe("basic headless test", function() {
  var server, browser;

  before(function() {
    server = app.listen(3001);
  });

  after(function() {
    server.close();
  });

  beforeEach(function() {
    browser = new Browser();
  });

  it("loads front page", function(done) {
   browser.visit('http://www.127.0.0.1.xip.io:3001/', function() {
      assert(browser.text(".hosting-app-welcome h1.text-center") === "Welcome to PopIt",
        "welcome text present");
      done();
    });
  });
});
