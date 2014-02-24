"use strict"; 

var mongoose         = require('mongoose'),
    Schema            = mongoose.Schema,
    ObjectId          = Schema.ObjectId,
    OtherName         = require('../schemas').OtherName,
    Identifier        = require('../schemas').Identifier,
    ContactDetail     = require('../schemas').ContactDetail,
    Link              = require('../schemas').Link,
    Image             = require('../schemas').Image,
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

OrganizationSchema.virtual('url').get(function() {
  return '/' + this.constructor.collection.name + '/' + this._id;
});

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

