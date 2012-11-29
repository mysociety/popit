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

  comment: {
    type: String,
    form_label: 'Comment',
    form_help_text: "Eg 'Personal homepage'",
  },

}, { strict: false } );
