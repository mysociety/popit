 var mongoose         = require('mongoose'),
    Schema            = mongoose.Schema,
    ObjectId          = Schema.ObjectId,
    Image             = require('../schemas').Image,
    deduplicate_slug  = require('./util').deduplicate_slug,
    slug              = require ('slug');


var OrganisationSchema = module.exports = new Schema({

  // Overview fields
  name: {
    type: String,
    required: true,
    trim: true,
    form_label: 'Name',
    form_help_text: "The organisation's most well known name",
    set: function(v) {
      // If we don't already have a slug set it
      if (!this.slug) {
        this.slug = v;
      }
      // Don't change the value
      return v;
    },
  },
  slug: {
    type:      String,
    required:  true,
    lowercase: true,
    trim:      true,
    unique:    true,
    set: function(v) { return slug(v); },    
  },
  summary: {
    type: String,
    form_label: 'Summary',
    form_help_text: "A brief bit of text to help identify the organisation",
    form_input_type: 'textarea',
  },

  images: [ Image ],

}, { strict: false } );

OrganisationSchema
  .virtual('slug_url')
  .get( function () { return '/organisation/' + this.slug;} );

OrganisationSchema
  .virtual('api_url')
  .get( function () { return config.api_root_url + '/organisation/' + this.id;} );

OrganisationSchema.pre( 'save', deduplicate_slug );

OrganisationSchema.methods.find_positions = function(cb) {
  return this
    .model('Position')
    .find( { organisation: this }, cb );
};
