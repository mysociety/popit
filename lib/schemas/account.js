var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    utils = require('../utils');

var Account = new Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [ utils.is_email, 'Invalid email address' ],
  },

});

Account.plugin(passportLocalMongoose, {
  usernameField: 'email',
});

module.exports = mongoose.model('Account', Account);
