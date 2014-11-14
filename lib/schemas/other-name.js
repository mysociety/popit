"use strict"; 

var mongoose         = require('mongoose'),
    Schema            = mongoose.Schema;


var OtherNamesSchema = module.exports = new Schema({
  name: { type: Schema.Types.Mixed, required: true, trim: true },
  note: Schema.Types.Mixed,
  start_date: String,
  end_date: String,
}, { strict: false } );

