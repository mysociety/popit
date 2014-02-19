"use strict"; 

var mongoose            = require('mongoose'),
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

}, { strict: false, collection: 'posts' } );

