"use strict"; 

var mongoose     = require('mongoose'),
    Schema       = mongoose.Schema,
    ObjectId     = Schema.ObjectId;

var PositionSchema = module.exports = new Schema({

  title:        {type: String,   required: true},
  person:       {type: ObjectId, ref: "Person"},
  organisation: {type: ObjectId, ref: "Organisation"},

}, { strict: false } );

PositionSchema
  .virtual('slug_url')
  .get( function () { return '/position/' + this.id;} );

PositionSchema
  .virtual('name')
  .get( function () { return this.title; } );
