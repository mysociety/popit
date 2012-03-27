var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    check    = require('validator').check,
    crypto   = require('crypto');

// TODO - move to utils library
var is_email = function (val) {
    try {
        check(val).isEmail();
        return true;
    } catch(err) {
        return false;
    }
}


var UserSchema = new Schema({
    email: {
        type:      String,
        required:  true,
        validate:  [ is_email, 'not_an_email' ],
        lowercase: true,
        trim:      true,
        unique:    true, // TODO - validate this nicely
    },

    // hex
    hashed_password: {
        type:     String,
        required: true,
    },

}, { strict: true } );


module.exports.UserSchema = UserSchema;
