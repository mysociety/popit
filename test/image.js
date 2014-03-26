"use strict";

var assert = require('assert');
var utils = require('../lib/utils');
var PopIt = require('../lib/popit');

describe("image", function() {
  var popit;
  var Image;

  beforeEach(function() {
    popit = new PopIt();
    popit.set_instance('test');
    Image = popit.model('Image');
  });

  beforeEach(utils.delete_all_testing_databases);

  it("image local path", function() {
    var image = new Image();

    assert(
      image.local_path.match( /^.{2}\/.{2}\/.{24}$/ ),
      "local_path looks right"
    );
  });
});
