 var mongoose    = require('mongoose'),
    Schema       = mongoose.Schema,
    ObjectId     = Schema.ObjectId;


var ContactDetailSchema = module.exports = new Schema({

  kind: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },

  // TODO: add these in later
  // comment: String, // eg "Only answered whilst parliament is in session"
  // source: String,  // eg "leaked internal phonebook" or "http://your.gov/foobar"

}, { strict: true } );
