"use strict";

var Twix   = require('twix/bin/twix'),
    moment = require('moment');

// for when https://github.com/icambron/twix.js/pull/2 applied
// var Twix = require('twix');

var partialDateFormat = module.exports.format = function (start,end) {

  var twix = new Twix(
    start,
    end,
    true                      // all day event - don't show the times
  );

  return twix.format({
    implicitYear: false, // Always show the year, even if it is the current one
  });
  
};

module.exports.plugin = function partialDatePlugin (schema, options) {

  var fieldName = options.fieldName;
  

  var args = {};
  args[fieldName] = {
    start:  { type: Date,   default: null, },
    end:    { type: Date,   default: null, },
    format: { type: String, default: '',   },
  };

  schema.add(args);
  
  schema
    .pre('save', function(next) {

      var format_path = fieldName + '.format';

      var dates = this.get(fieldName);
      
      if ( dates && dates.start && dates.end ) {
        this.set(format_path, partialDateFormat( dates.start, dates.end ));
      } else {
        this.set(format_path, '');
      }
      
      next();

    });

  // if we have just a start time use it to populate the end time
  // schema.pre('validate', function (next) {
  //   if ( ! this.get(fieldName).end ) {
  //     this.set(fieldName + '.end', this.get(fieldName).start);
  //   } 
  //   next();
  // });

  // Validators. Check that we have both, or neither, of start and end. Check that
  // start <= end.

  // return true if both are true, or both are false
  function both_or_neither (dates) {
    if ( dates.start && dates.end ) return true;
    if ( dates.start || dates.end ) return false;
    return true;
  }

  schema
    .path(fieldName + '.end')
    .validate(
      function (value) {
        return both_or_neither( this.get(fieldName) );          
      },
      "start date is missing"
    );
  schema
    .path(fieldName + '.start')
    .validate(
      function (value) {
        return both_or_neither( this.get(fieldName) );          
      },
      "end date is missing"
    );
  schema
    .path(fieldName + '.start')
    .validate(
      function (value) {
        return this.get(fieldName).start <= this.get(fieldName).end;
      },
      "start date is after end date"
    );

};

function cleanse_date_string (string) {
  var parsed = moment(string); // be loose, could add the "YYYY-MM-DD" format to be stricter
  if ( parsed && parsed.isValid() ) {
    return parsed.format('YYYY-MM-DD');
  } else {
    return '';
  }
  
}

module.exports.parser = function partialDateParser ( date_string ) {

  var parts        = date_string.split(/\s+to\s+/);
  var start_string = parts[0] || '';
  var end_string   = parts[1] || start_string;
    
  var result = {
    start: cleanse_date_string(start_string),
    end:   cleanse_date_string(end_string),
  };
  
  if ( ! result.end ) result.start = '';
 
  return result;
};

