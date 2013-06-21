"use strict"; 

var mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    ObjectId            = Schema.ObjectId;

var PositionSchema = module.exports = new Schema({

  title:        {type: String,   required: true},
  person:       {type: String, ref: "Person"},
  organization: {type: String, ref: "Organization"},
  start_date: String,
  end_date: String,

}, { strict: false, collection: 'memberships' } );

PositionSchema
  .virtual('slug_url')
  .get( function () { return '/position/' + this.id;} );

PositionSchema
  .virtual('name')
  .get( function () { return this.title; } );

PositionSchema.methods.additional_meta = function() {
  var additional = {
    api_url:           'position/' + this.id,    
  };

  if ( this.person ) {
    additional.person_api_url = 'person/' + this.person;
  }
    
  if ( this.organization ) {
    additional.organization_api_url = 'organization/' + this.organization;
  }
  
  return additional;
};
