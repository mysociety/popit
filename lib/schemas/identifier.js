"use strict";

var mongoose         = require('mongoose'),
    Schema            = mongoose.Schema;

var IdentifierSchema = module.exports = new Schema({
  identifier: { type: String, required: true, trim: true },
  scheme: String,
}, { strict: false } );

