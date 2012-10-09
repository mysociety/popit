var Twix = require('twix/bin/twix');

// for when https://github.com/icambron/twix.js/pull/2 applied
// var Twix = require('twix');

module.exports = function partialDatePlugin (schema, options) {

  var fieldName = options.fieldName;

  var args = {};
  args[fieldName] = {
    start: Date,
    end:   Date,
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
      return twix.format();
    });

}
