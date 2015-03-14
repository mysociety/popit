"use strict"; 

var mongoose    = require('mongoose'),
    Schema       = mongoose.Schema,
    ObjectId     = Schema.ObjectId,
    mmm = require('mmmagic'),
    Magic = mmm.Magic;


var ImageSchema = module.exports = new Schema({

  created:   { type: Date, default: Date.now },
  url:       String, // Optional, if remote image
  source:    String,
  license:   String,
  note:      String,
  mime_type: String,

}, { strict: false } );

ImageSchema.statics.path_base = function path_base(id) {
  var matches = id.match( /^(..)(..)/ );
  var path = matches[1] + '/' + matches[2] + '/' + id;
  return path;
};

ImageSchema.statics.mime_type_for = function mime_type_for(path, callback) {
  var magic = new Magic(mmm.MAGIC_MIME_TYPE);
  magic.detectFile(path, callback);
};

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
