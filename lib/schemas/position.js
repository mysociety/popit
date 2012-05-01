var mongoose     = require('mongoose'),
    Schema       = mongoose.Schema,
    ObjectId     = Schema.ObjectId;

var PositionSchema = module.exports = new Schema({

  title:        {type: String,   required: true},
  person:       {type: ObjectId, ref: "Person"},
  organisation: {type: ObjectId, ref: "Organisation"},

}, { strict: true } );
