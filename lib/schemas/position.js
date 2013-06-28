"use strict"; 

var mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    ObjectId            = Schema.ObjectId;

var PositionSchema = module.exports = new Schema({

  title:        {type: String,   required: true},
  person_id:    {type: String, ref: "Person"},
  organization_id: {type: String, ref: "Organization"},
  start_date: String,
  end_date: String,

}, { strict: false, collection: 'memberships' } );

PositionSchema
  .virtual('slug_url')
  .get( function () { return '/position/' + this.id;} );

PositionSchema
  .virtual('name')
  .get( function () { return this.title; } );

