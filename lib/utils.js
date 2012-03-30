var check      = require('validator').check,
    bcrypt     = require('bcrypt'),
    passgen    = require('passgen'),
    config     = require('config'),
    _          = require('underscore'),
    mongodb    = require('mongodb').Db,
    Server     = require('mongodb').Server,
    async      = require('async');

    // Server = require('mongodb').Server,
    // ReplSetServers = require('mongodb').ReplSetServers,
    // ObjectID = require('mongodb').ObjectID,
    // Binary = require('mongodb').Binary,
    // GridStore = require('mongodb').GridStore,
    // Code = require('mongodb').Code,
    // BSON = require('mongodb').pure().BSON,
    // assert = require('assert');


module.exports.is_email = function (val) {
    try {
        check(val).isEmail();
        return true;
    } catch(err) {
        return false;
    }
};


module.exports.password_hash = function (plaintext, cb) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err) throw err;
        bcrypt.hash(plaintext, salt, function(err, hash) {
            if (err) throw err;
            cb(hash);
        });
    });
};

module.exports.password_hash_compare = function (plaintext, hash, cb) {
    bcrypt.compare( plaintext, hash, function (err, is_same) {
        if (err) throw err;
        cb(is_same);
    });
};


module.exports.password_and_hash_generate = function (cb) {
    var password = passgen.create(8);

    module.exports.password_hash( password, function (hash) {
        cb( password, hash );
    });
};


module.exports.mongodb_connection_string = function(name) {
    
    if (!name)
        throw new Error("must provide a db name to mongodb_connection_string");
    
    return 'mongodb://'
        + config.MongoDB.host
        + '/'
        + config.MongoDB.popit_prefix
        + name;
};


module.exports.delete_all_testing_databases = function (done_deleting_cb) {

    // sanity check
    if ( ! config.testing_config_loaded )
        throw new Error("Will not delete databases unless testing config has been loaded" );

    // what is our prefix
    var popit_prefix = config.MongoDB.popit_prefix;

    // connect to the main database
    var db = new mongodb(
        popit_prefix + 'all',
        new Server(config.MongoDB.host, config.MongoDB.port)
    );

    // handle all the listing of database names
    var list_testing_databases = function (cb) {
        db.open(function(err, db) {
            if (err) throw err;
            db.admin(function(err, adminDb) {
                if (err) throw err;
                adminDb.listDatabases(function(err, dbs) {
                    if (err) throw err;

                    var master_db_names  = _.pluck( dbs.databases, 'name' );
                    var testing_db_names = _.filter( master_db_names, function (name) { return name.indexOf(popit_prefix) == 0 });

                    cb( testing_db_names );
                });
            });
        });        
    };

    // delete a specific database
    var delete_database = function ( name, cb ) {

        // console.log( "Will delete " + name );
        
        var to_delete_db = new mongodb(
            name,
            new Server(config.MongoDB.host, config.MongoDB.port)
        );

        to_delete_db.open( function(err, db) {
            if (err) throw err;
            to_delete_db.dropDatabase(function(err, done) {
                if (err) throw err;
                to_delete_db.close();
                cb();
            });
        });                                
    };


    list_testing_databases( function(testing_db_names) {
        async.forEachSeries(
            testing_db_names,
            function ( name, cb ) {
                delete_database( name, cb );
            },
            function (err) {
                if (err) console.log( err );
                db.close();
                done_deleting_cb(err);
            }
        );
    });
    
};

