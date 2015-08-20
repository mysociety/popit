"use strict";

var assert = require('assert');
var Browser = require('zombie');

describe("homepage", function() {
  var browser = new Browser();

  before(function(done) {
    browser.visit('/', done);
  });

  it("loads successfully", function() {
    browser.assert.success();
  });

  it("contains link to all instances", function() {
    browser.assert.link('a', 'Browse existing PopIts', '/instances');
  });
});
