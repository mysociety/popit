var mongoose         = require('mongoose'),
Schema            = mongoose.Schema,
ObjectId          = Schema.ObjectId,
passgen           = require('passgen'),
config            = require('config'),
utils             = require('../utils'),
url               = require('url'),
http              = require('http'),
async             = require('async'),
InstanceInfo      = require('../schemas').InstanceInfo;


var InstanceSchema = new Schema({
  slug: {
    type:      String,
    lowercase: true,
    trim:      true,
    match:     /^[a-z][a-z0-9\-]{3,19}$/,
    validate:  [
    function( v, fn ) {
      // run on insert only, when we don't have an ID
      // FIXME - find better way to handle this and test
      if ( ! this.isNew ) return fn( true );
        
      this.collection.count(
      {
        slug: v
      },
      function (err, count) {
        fn( count ? false : true );
      }
      );
    },
    'slug_not_unique'
    ],
    unique:    true,
    required:  true,
  },
  created_date: {
    type: Date,
    'default': Date.now
  },

  status: {
    type: String,
    required: true,
    'default': 'pending',
    'enum': [
    'pending',   // has not been activated yet - db does not exist
    'active',    // created and available
    'suspended', // blocked for some reason
    'archived',  // has been archived due to lack of use
    ],
  },

  email: {
    type: String,
    required: true,
    validate: [ utils.is_email, 'not_an_email' ]
  },

  // Initial info needed to set up the instance - should be cleared once
  // instance configured.
  setup_info: {
    // initial password for
    password_hash: {
      type: String,
    },
    confirmation_token: {
      type: String,
      'default': function () {
        return passgen.create(16);
      },
    }
  },

  // details - a hash that is created from values in the instance. Eg number of
  // entities stored, name and description. This is collected by a cron job and
  // used to provide information on the instance.

  info: [InstanceInfo],


// domains - the domains that map to this instance. These are in addition to the
// default popit domain.
    
}, {
  strict: true
} );

InstanceSchema
  .virtual('base_url')
  .get(function () {
    return utils.instance_base_url_from_slug(this.slug);
  });

InstanceSchema.statics.sync = function(callback) {

  this
  .find({},  function (err, docs) {
    if(err) throw err;
    async.forEachSeries(
      docs,
      function (doc, cb){
        var instanceAPIURL = utils.instance_base_url_from_slug( doc.slug ) + '/api/v1/about/';
        http.get(url.parse(instanceAPIURL), function(res){
          var aboutJSON = '';
          res.on('data', function (chunk){
            aboutJSON += chunk;
          });
          res.on('end',function(){
            var Info = mongoose.model('Info', InstanceInfo);
            var aboutObj = new Info( JSON.parse(aboutJSON).result );
            doc.info = [ aboutObj ];
            doc.save(function (err){
              if(err) throw err;
              cb();
            });
          });
        });
      },
      function (err) {
        if (err) throw err;
        callback();
      });
  });
};

module.exports = InstanceSchema;
