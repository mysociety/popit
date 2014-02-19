"use strict"; 

var mongoose            = require('mongoose'),
    Schema              = mongoose.Schema;

var MembershipSchema = module.exports = new Schema({
  _id: {
    type: String,
    default: function() {
      return (new mongoose.Types.ObjectId()).toHexString();
    }
  },

  label: { type: String },
  role: { type: String },
  person_id: { type: String, ref: "Person", required: true },
  organization_id: { type: String, ref: "Organization" },
  post_id: { type: String, ref: "Post" },
  start_date: String,
  end_date: String,

}, { strict: false, collection: 'memberships' } );

MembershipSchema
  .virtual('slug_url')
  .get( function () { return '/memberships/' + this.id;} );

MembershipSchema
  .virtual('name')
  .get( function () { return this.role; } );

