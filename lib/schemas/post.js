"use strict"; 

var mongoose            = require('mongoose'),
    _                   = require('underscore'),
    Schema              = mongoose.Schema;

var PostSchema = module.exports = new Schema({
  _id: {
    type: String,
    default: function() {
      return (new mongoose.Types.ObjectId()).toHexString();
    }
  },

  label: { type: String, required: true},
  role: String,
  organization_id: { type: String, ref: "Organization", required: true },
  start_date: String,
  end_date: String,
  area: {
    name: String,
  },

}, { strict: false, collection: 'posts' } );

PostSchema.virtual('url').get(function() {
  return '/' + this.constructor.collection.name + '/' + this._id;
});

PostSchema.virtual('initials').get(function() {
  var words = this.label.split(' ');
  if (words.length > 1) {
    return words[0].slice(0, 1) + _.last(words).slice(0, 1);
  } else {
    return words[0].slice(0, 1);
  }
});

PostSchema.methods.find_memberships = function find_memberships(cb) {
  var Membership = this.model('Membership');
  return Membership.find({ post_id: this.id }, cb);
};
