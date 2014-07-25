"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passgen = require('passgen');

var InviteSchema = new Schema({

  email: {
    type: String,
    required: true,
  },

  instance: {
    type: Schema.Types.ObjectId,
    ref: 'Instance',
    required: true,
  },

  code: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return passgen.create(32);
    },
  },

  created: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model('Invite', InviteSchema);
