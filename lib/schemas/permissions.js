"use strict"; 

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var PermissionsSchema = new Schema({
    account_id: {
        type:      String,
        required:  true,
    },

    instance_id: {
        type:     String,
        required: true,
    },

}, { strict: true } );

PermissionsSchema.statics.getPermissions = function(user_id, instance_id, callback) {
  this
    .model('Permissions')
    .count( { account_id: user_id, instance_id: instance_id }, function ( err, count) {
      var can_edit = false;
      if (err) {
        callback(err);
      }
      if ( count == 1 ) {
        can_edit = true;
      }
      callback(null, { can_edit_instance: can_edit } );
    });
};


module.exports = mongoose.model('Permissions', PermissionsSchema);
