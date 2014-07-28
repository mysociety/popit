"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    utils = require('../utils'),
    crypto = require('crypto');

var Account = new Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [ utils.is_email, 'Invalid email address' ],
  },

  name: {
    type: String,
    required: true,
  },

  resetPasswordToken: {
    type: String,
    unique: true,
  },

  resetPasswordExpires: Date,

});

Account.plugin(passportLocalMongoose, {
  usernameField: 'email',
});

Account.methods.setResetPasswordToken = function setResetPasswordToken(callback) {
  var account = this;
  crypto.randomBytes(20, function(err, buffer) {
    if (err) {
      return callback(err);
    }
    var token = buffer.toString('hex');
    account.resetPasswordToken = token;
    account.resetPasswordExpires = Date.now() + (60 * 60 * 24 * 1000); // 24 hours
    account.save(function(err) {
      callback(err, token);
    });
  });
};

module.exports = mongoose.model('Account', Account);
