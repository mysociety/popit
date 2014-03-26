"use strict";

var assert = require('assert');
var utils = require('../lib/utils');
var _ = require('underscore');

describe("middleware", function() {

  it("extracts slug from popit domain name", function() {
    var suffix = 'popitdomain.org:1234';
    var tests = {};

    // slug.popitdomain.org tests
    tests['foo.' + suffix] = 'foo';
    tests['test.' + suffix] = 'test';
    tests['f12345.' + suffix] = 'f12345';

    _.each(tests, function(slug, hostname) {
      assert.equal(
        utils.extract_slug(hostname),
        slug,
        "Get '" + slug + "' from '" + hostname + "'"
      );
    });
  });

});
