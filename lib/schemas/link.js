"use strict"; 

var mongoose    = require('mongoose'),
    Schema       = mongoose.Schema,
    ObjectId     = Schema.ObjectId;


var LinkSchema = module.exports = new Schema({

  url: {
    type: String, // TODO - add url validator here, or URL type
    required: true,
    form_label: 'URL',
  },

  note: {
    type: String,
    form_label: 'Note',
    form_help_text: "Eg 'Personal homepage'",
  },

}, { strict: false } );
