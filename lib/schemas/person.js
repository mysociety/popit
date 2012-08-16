var mongoose          = require('mongoose'),
    DoubleMetaphone   = require('doublemetaphone'),
    dm                = new DoubleMetaphone(),
    unorm             = require('unorm'),
    _                 = require('underscore'),
    regexp_quote      = require('regexp-quote'),
    Schema            = mongoose.Schema,
    ObjectId          = Schema.ObjectId,
    ContactDetail     = require('../schemas').ContactDetail,
    OtherName         = require('../schemas').OtherName,
    Link              = require('../schemas').Link,
    Image             = require('../schemas').Image,
    deduplicate_slug  = require('./util').deduplicate_slug,
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
      // Set normalized array of words for searching
      var words = _.union(
        v.split(/\s+/).map( function(s) {
          return s.toLowerCase();
        }),
        v.split(/\s+/).map( function(s) {
          return unorm.nfkd(s.toLowerCase()).replace(/[\u0300-\u036F]/g, '');
        })
      );
      this.name_words = words;
      // Set the double metaphone entries. Currently just stores both primary and secondary without saying which is which
      var dm_words = [];
      words.forEach( function(w) { dm_words.push.apply(dm_words, _.values(dm.doubleMetaphone(w)) ) } );
      // Also include the words to make the searching easier. Perhaps this can be just one array?
      this.name_dm = dm_words.concat(words);
      // If we don't already have a slug set it
      if (!this.slug) this.slug = v;
      // Don't change the value
      return v;
    },
  },
  name_dm: [],
  name_words: [],
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
  other_names: [OtherName],

  // Contact details such as phone numbers, email, postal addresses etc.
  contact_details: [ContactDetail],

  // Links to other sites that have relevant information
  links: [Link],

  // Images of this person
  images: [ Image ],

}, { strict: false } );

PersonSchema
  .virtual('slug_url')
  .get( function () { return '/person/' + this.slug;} );

// TODO - perhaps better implemented as a plugin?
PersonSchema.pre( 'save', deduplicate_slug );


PersonSchema.methods.find_positions = function(cb) {
  return this
    .model('Position')
    .find( { person: this }, cb );
};

PersonSchema.statics.name_search = function(search, cb) {
  if (!search) {
    return cb();
  }

  var search_words = search.split(/\s+/);
  var search_words_re = search_words.map( function(word) { return new RegExp( regexp_quote(word), 'i' ); } );

  var m = this;
  m.find()
    .select('name','slug')
    .all('name_words', search_words_re)
    .exec(function(err,docs) {
        if (err) throw err;
        if ( docs.length > 0 ) {
            return cb(docs);
        }

        // TODO Secondary metaphone results...
        var or = [];
        function perm(s, o) {
            if (s.length) {
                o.push( new RegExp(regexp_quote(s[0]), 'i') ); perm(s.slice(1), o); o.pop();
                o.push( dm.doubleMetaphone(s[0]).primary ); perm(s.slice(1), o); o.pop();
            } else {
                or.push( { 'name_dm': { '$all': o.slice(0) } } );
            }
        }
        perm(search_words, []);

        m.find({ '$or': or }, ['name', 'slug'])
            .exec(function(err,docs) {
                if (err) throw err;
                cb(docs);
            });
    });
};
