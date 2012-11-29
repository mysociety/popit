"use strict"; 

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    passgen  = require('passgen'),
    utils    = require('../utils');

var TokenSchema = module.exports = new Schema({
    _id: {
        type:      String,
        required:  true,
        unique:    true,
        default:   function () { return passgen.create(32); }, // collision risk negligable
    },
    action: {
      type:     String,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    expires: {
      type: Date,
      default: function() {
        return Date.now() + 3 * 86400 * 1000; // 3 days
      },
    },
    args: {}
}, { strict: true } );

TokenSchema.statics.findValid = function findValid (id, cb) {
  return this.findById( id, function(err,doc) {
    if (err)  return cb(err,  null);
    if (!doc) return cb(null, null);

    // If expired delete it
    if ( doc.expires < Date.now() ) {
      doc.remove(function(err) {
        return cb(err, null);
      });
    } else {
      return cb(null, doc);
    }

  });
};
