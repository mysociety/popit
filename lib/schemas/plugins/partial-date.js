"use strict";

var Twix = require('twix/bin/twix');

// for when https://github.com/icambron/twix.js/pull/2 applied
// var Twix = require('twix');

module.exports = function partialDatePlugin (schema, options) {

  var fieldName = options.fieldName;

  var args = {};
  args[fieldName] = {
    start: Date,
    end:   Date,
    // formatted: { type: String, default: '' },
  };

  schema.add(args);
  
  schema
    .virtual(fieldName + '.format')
    .get(function() {
      var twix = new Twix(
        this[fieldName].start,
        this[fieldName].end,
        true                      // all day events - don't show the times
      );
      return twix.format({
        implicitYear: false, // Always show the year, even if it is the current one
      });
    });

  // Validators. Check that we have both, or neither, of start and end. Check that
  // start <= end.
  schema
    .path(fieldName + '.end')
    .validate(
      function (value) {
        return !! this[fieldName].start;
      },
      "start date is missing"
    );
  schema
    .path(fieldName + '.start')
    .validate(
      function (value) {
        return !! this[fieldName].end;
      },
      "end date is missing"
    );
  schema
    .path(fieldName + '.start')
    .validate(
      function (value) {
        return this[fieldName].start <= this[fieldName].end;
      },
      "start date is after end date"
    );

  

};
