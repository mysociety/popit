var mongoose     = require('mongoose'),
    Schema       = mongoose.Schema;

var InstanceInfoSchema = new Schema({
  name:                 String,
  description:          String,
  region:               String,
  purpose:              String,
  contact_name:         String,
  contact_email:        String,
  contact_phone:        String,
  organisation_count:   { type: Number, min: 0},
  person_count:         { type: Number, min: 0},
  last_updated:         {type: Date, default: Date.now}

}, { strict: true } );

module.exports = InstanceInfoSchema;