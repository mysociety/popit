 var mongoose    = require('mongoose'),
    Schema       = mongoose.Schema,
    ObjectId     = Schema.ObjectId;


var LinkSchema = module.exports = new Schema({

  url: {
    type: String, // TODO - add url validator here, or URL type
    required: true,
  },

  comment: {
    type: String,
  },

}, { strict: true } );
