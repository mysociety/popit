"use strict"; 

 var mongoose    = require('mongoose'),
    Schema       = mongoose.Schema,
    ObjectId     = Schema.ObjectId;


var ContactDetailSchema = module.exports = new Schema({

  label: String,

  type: {
    type: String,
    required: true,
    form_label: 'Type',
    form_help_text: "Eg 'cell', 'email', 'url', 'address', etc",
  },

  value: {
    type: String,
    required: true,
    form_label: 'Contact details',
    form_help_text: "Eg 'joe@example.com', '@joe', etc",
    form_input_type: 'textarea',
  },

  note: String

}, { strict: false } );
