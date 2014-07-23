"use strict"; 

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var PermissionsSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required:  true
    },

    instance: {
        type: Schema.Types.ObjectId,
        ref: 'Instance',
        required: true
    },

    role: {
      type: String,
      required: true,
      enum: ['owner', 'editor'],
    },

}, { strict: true } );

module.exports = mongoose.model('Permissions', PermissionsSchema);
