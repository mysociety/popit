 var mongoose    = require('mongoose'),
    Schema       = mongoose.Schema,
    ObjectId     = Schema.ObjectId;


module.exports = new Schema({

  // Overview fields
  name:    String,
  summary: String,
  
  // Profile fields - dob, dod, gender
  
  // Names - historic and alternative names

  // Contact information - phone, mobile, email, web pages


}, { strict: true } );
