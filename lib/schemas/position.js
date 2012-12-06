"use strict"; 

var mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    ObjectId            = Schema.ObjectId,
    partialDatePlugin   = require('./plugins/partial-date').plugin;

var PositionSchema = module.exports = new Schema({

  title:        {type: String,   required: true},
  person:       {type: ObjectId, ref: "Person"},
  organisation: {type: ObjectId, ref: "Organisation"},

}, { strict: false } );

// Add in the start and end dates
PositionSchema.plugin( partialDatePlugin, {fieldName: 'start_date'} );
PositionSchema.plugin( partialDatePlugin, {fieldName: 'end_date'  } );

PositionSchema
  .virtual('slug_url')
  .get( function () { return '/position/' + this.id;} );

PositionSchema
  .virtual('name')
  .get( function () { return this.title; } );

PositionSchema.methods.additional_meta = function() {
  var additional = {};

  if ( this.person ) {
    additional.person_api_url = 'person/' + this.person;
  }
    
  if ( this.organisation ) {
    additional.organisation_api_url = 'organisation/' + this.organisation;
  }
  
  return additional;
};
