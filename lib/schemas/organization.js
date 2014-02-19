"use strict"; 

var mongoose         = require('mongoose'),
    Schema            = mongoose.Schema,
    ObjectId          = Schema.ObjectId,
    OtherName         = require('../schemas').OtherName,
    Identifier        = require('../schemas').Identifier,
    ContactDetail     = require('../schemas').ContactDetail,
    Link              = require('../schemas').Link,
    Image             = require('../schemas').Image,
    deduplicate_slug  = require('./util').deduplicate_slug,
    slug              = require ('slug'),
    config            = require('config');


var OrganizationSchema = module.exports = new Schema({
  _id: {
    type: String,
    default: function() {
      return (new mongoose.Types.ObjectId()).toHexString();
    }
  },

  // Overview fields
  name: {
    type: String,
    required: true,
    trim: true,
    form_label: 'Name',
    form_help_text: "The organization's most well known name",
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
    set: function(v) { return slug(v); },    
  },
  summary: {
    type: String,
    form_label: 'Summary',
    form_help_text: "A brief bit of text to help identify the organization",
    form_input_type: 'textarea',
  },

  founding_date: String,
  dissolution_date: String,

  classification: String,
  parent_id: { type: String, ref: "Organization" },

  identifiers: [ Identifier ],
  other_names: [ OtherName ],
  contact_details: [ ContactDetail ],
  links: [ Link ],
  images: [ Image ],

}, { strict: false, collection: 'organizations' } );

OrganizationSchema
  .virtual('slug_url')
  .get( function () { return '/organizations/' + this.slug;} );

OrganizationSchema.pre( 'save', deduplicate_slug );

OrganizationSchema.methods.find_memberships = function(cb) {
  return this
    .model('Membership')
    .find( { organization_id: this.id }, cb );
};

OrganizationSchema.methods.find_posts = function(cb) {
  return this
    .model('Post')
    .find( { organization_id: this.id }, cb );
};

