var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    check    = require('validator').check,
    crypto   = require('crypto'),
    utils    = require('../utils');

var UserSchema = new Schema({
    email: {
        type:      String,
        required:  true,
        validate:  [ utils.is_email, 'not_an_email' ],
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
