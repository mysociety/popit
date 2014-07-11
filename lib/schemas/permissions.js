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

    permissions: {
        type:    Object
    }
}, { strict: true } );

PermissionsSchema.statics.getPermissions = function(user_id, instance_id, callback) {
  this
    .model('Permissions')
    .find( { account: user_id, instance: instance_id } )
    .exec( function ( err, permissions ) {
      var user_permissions = {};
      if (err) {
        callback(err);
      }
      if ( permissions.length == 1 ) {
        user_permissions = permissions[0].permissions;
      }
      callback(null, user_permissions );
    });
};


module.exports = mongoose.model('Permissions', PermissionsSchema);
