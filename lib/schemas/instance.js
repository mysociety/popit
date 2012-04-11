 var mongoose    = require('mongoose'),
    Schema       = mongoose.Schema,
    ObjectId     = Schema.ObjectId,
    passgen      = require('passgen'),
    utils        = require('../utils');


module.exports = new Schema({
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
                    { slug: v },
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
    created_date: { type: Date, 'default': Date.now },

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
            'default': function () { return passgen.create(16); },            
        }
    },

    // details - a hash that is created from values in the instance. Eg number of
    // entities stored, name and description. This is collected by a cron job and
    // used to provide information on the instance.
        
    // domains - the domains that map to this instance. These are in addition to the
    // default popit domain.
    
}, { strict: true } );
