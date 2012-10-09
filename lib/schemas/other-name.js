"use strict"; 

var mongoose         = require('mongoose'),
    Schema            = mongoose.Schema;


var OtherNamesSchema = module.exports = new Schema({
  name: { type: String, required: true, trim: true },
  comment: String,
  // start date
  //end date
}, { strict: false } );

