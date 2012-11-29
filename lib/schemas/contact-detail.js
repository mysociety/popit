"use strict"; 

 var mongoose    = require('mongoose'),
    Schema       = mongoose.Schema,
    ObjectId     = Schema.ObjectId;


var ContactDetailSchema = module.exports = new Schema({

  kind: {
    type: String,
    required: true,
    form_label: 'Type',
    form_help_text: "Eg 'Phone', 'Email', 'Twitter', 'Address', etc",
  },

  value: {
    type: String,
    required: true,
    form_label: 'Contact details',
    form_help_text: "Eg 'joe@example.com', '@joe', etc",
    form_input_type: 'textarea',
  },

  // TODO: add these in later
  // comment: String, // eg "Only answered whilst parliament is in session"
  // source: String,  // eg "leaked internal phonebook" or "http://your.gov/foobar"

}, { strict: false } );
