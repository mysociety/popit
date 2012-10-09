"use strict"; 

var mongoose    = require('mongoose'),
    Schema       = mongoose.Schema,
    ObjectId     = Schema.ObjectId;


var MigrationSchema = module.exports = new Schema({

  created:   { type: Date, default: Date.now },
  source: {
    name:       String,
    mime_type:  String,
    parsed: {
      header:   Array,
      data:     Schema.Types.Mixed
    },
  },
  tracking: {
    progress:   Number,
    total:      Number,
    count:      Number,
    err:        Schema.Types.Mixed
  }

}, { strict: true } );
