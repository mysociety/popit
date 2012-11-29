"use strict"; 

var mongoose    = require('mongoose'),
    Schema       = mongoose.Schema,
    ObjectId     = Schema.ObjectId;


var ImageSchema = module.exports = new Schema({

  created:   { type: Date, default: Date.now },
  url:       String, // Optional, if remote image
  source:    String,
  license:   String,
  comment:   String,
  mime_type: String,

}, { strict: false } );

ImageSchema
  .virtual('local_path_base')
  .get(function() {
    var id = this.id + '';

    var matches = id.match( /^(..)(..)/ );
  
    var path = matches[1] + '/' + matches[2] + '/' + id;
    
    return path;
  });

ImageSchema
  .virtual('local_path')
  .get(function() {
    return this.local_path_base;
  });
