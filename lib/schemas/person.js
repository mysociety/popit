 var mongoose         = require('mongoose'),
    Schema            = mongoose.Schema,
    ObjectId          = Schema.ObjectId,
    ContactDetail     = require('../schemas').ContactDetail,
    Link              = require('../schemas').Link,
    slug              = require ('slug');


var PersonSchema = module.exports = new Schema({

  // Overview fields
  name: {
    type: String,
    required: true,
    trim: true,
    form_label: 'Name',
    form_help_text: "The person's most well known name",
    set: function(v) {
      // If we don't already have a slug set it
      if (!this.slug) this.slug = v;
      // Don't change the value
      return v;
    },
  },
  slug: {
    type:      String,
    required:  true,
    lowercase: true,
    trim:      true,
    unique:    true,
    set: function(v) { return slug(v); },    
  },
  summary: {
    type: String,
    form_label: 'Summary',
    form_help_text: "A brief bit of text to help identify the person",
    form_input_type: 'textarea',
  },
  
  // Profile fields - dob, dod, gender
  
  // Names - historic and alternative names

  // Contact details such as phone numbers, email, postal addresses etc.
  contact_details: [ContactDetail],

  // Links to other sites that have relevant information
  links: [Link],

  // Images of this person
  images: [{type: ObjectId, ref: "Image"}],

}, { strict: true } );

PersonSchema
  .virtual('slug_url')
  .get( function () { return '/person/' + this.slug;} );

PersonSchema.methods.deduplicate_slug = function deduplicate_slug (cb) {
  var self = this;
  
  // find other entries in the database that have the same slug
  this.collection.findOne({slug: self.slug, _id: { $ne: self._id } }, function(err, doc) {

    if (err) return cb(err);
    
    // if nothing found then no need to change slug
    if ( ! doc ) return cb(null);
    
    // we have a conflict, increment the slug
    var matches = self.slug.match(/^(.*)\-(\d+)$/);
    
    if ( !matches ) {
      self.slug = self.slug + '-1';
    } else {
      var base_slug = matches[1];
      var counter   = parseInt(matches[2]) + 1;
      self.slug     = base_slug + '-' + counter;
    }

    return self.deduplicate_slug(cb); // recurse

  });
};




