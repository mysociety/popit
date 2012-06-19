var mongoose     = require('mongoose'),
    Schema       = mongoose.Schema,
    ObjectId     = Schema.ObjectId,
    utils        = require('../utils');

var InstanceInfoSchema = new Schema({

  instance:             {type: ObjectId, ref: "Instance"},
  name:                 String,
  description:          String,
  region:               String,
  purpose:              String,
  contact_name:         String,
  contact_email:        String,
  contact_phone:        String,
  organisation_count:   { type: Number, min: 0},
  person_count:         { type: Number, min: 0},
  last_updated:         {type: Date, default: Date.now},
    
}, { strict: true } );

InstanceInfoSchema
  .virtual('url')
  .get(function () {
    return utils.instance_base_url_from_slug(this.name);
  });

module.exports = InstanceInfoSchema;
