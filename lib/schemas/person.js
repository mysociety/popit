 var mongoose    = require('mongoose'),
    Schema       = mongoose.Schema,
    ObjectId     = Schema.ObjectId,
    slug         = require ('slug');


var PersonSchema = module.exports = new Schema({

  // Overview fields
  name: {
    type: String,
    required: true,
    trim: true,
    form_label: 'Name',
    form_help_text: "The person's most well known name",
    set: function(v) {
      // If we don't already have a slug set it
      if (!this.slug) this.slug = v;
      // Don't change the value
      return v;
    },
  },
  slug: {
    type:      String,
    required:  true,
    lowercase: true,
    trim:      true,
    index:     true,
    set: function(v) { return slug(v); },    
  },
  summary: {
    type: String,
    form_label: 'Summary',
    form_help_text: "A brief bit of text to help identify the person",
    form_input_type: 'textarea',
  },
  foo: {
    bar: {
      type: String,
      form_input_type: 'textarea',
      form_label: 'Foo Bar',
      form_help_text: "This is the helptext, blah blah",
    },
  }
  
  // Profile fields - dob, dod, gender
  
  // Names - historic and alternative names

  // Contact information - phone, mobile, email, web pages


}, { strict: true } );
