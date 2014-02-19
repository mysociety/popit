"use strict"; 

var mongoose          = require('mongoose'),
    Schema            = mongoose.Schema,
    ObjectId          = Schema.ObjectId,
    passgen           = require('passgen'),
    restler           = require('restler'),
    config            = require('config'),
    winston           = require('winston'),
    utils             = require('../utils'),
    url               = require('url'),
    http              = require('http'),
    async             = require('async');


var InstanceSchema = new Schema({
  slug: {
    type:      String,
    lowercase: true,
    trim:      true,
    match:     [/^[a-z][a-z0-9\-]{3,19}$/, 'regexp'],
    validate:  [
    function( v, fn ) {
      // run on insert only, when we don't have an ID
      // TODO - find better way to handle this and test
      // Will become irrelevant once https://github.com/mysociety/popit/issues/175 is implemented
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
    required:  'required',
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
    required: 'required',
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
  info: {
    name:                 String,
    description:          String,
    region:               String,
    purpose:              String,
    contact_name:         String,
    contact_email:        String,
    contact_phone:        String,
    organization_count:   { type: Number, min: 0 },
    person_count:         { type: Number, min: 0 },
    last_updated:         Date,
  },


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


InstanceSchema.methods.fetch_info_from_instance = function(done_syncing) {

  var instance = this;
  var apiUrl   = instance.base_url + '/api/v0.1/about/';
  // winston.verbose( apiUrl );

  restler
    .get(apiUrl)
    .on('complete', function (result, response) {

      // If we get an error abort here, return error
      if (result instanceof Error) {
        winston.error( 'Error getting ' + apiUrl + ': ', result );
        return done_syncing(result);
      }

      // result.result is the object we want to save to this instance
      var info = result.result;
      info.last_updated = Date.now();
      instance.info = info;
      instance.save(done_syncing);
    });

};


InstanceSchema.statics.fetch_all_active_instance_info = function(done_syncing) {

  this
    .find({ status: 'active' })
    .exec( function (err, instances) {
      if (err) throw err;
  
      async.forEachSeries(
        instances,
        function (instance, cb) {
          instance.fetch_info_from_instance(cb);
        },
        done_syncing
      );
    });

};


module.exports = InstanceSchema;
