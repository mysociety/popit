var check      = require('validator').check,
    bcrypt     = require('bcrypt'),
    passgen    = require('passgen'),
    config     = require('config'),
    winston    = require('winston'),
    _          = require('underscore'),
    mongodb    = require('mongodb').Db,
    Server     = require('mongodb').Server,
    async      = require('async'),
    util       = require('util'),
    fixtures   = require('pow-mongodb-fixtures');

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


var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
module.exports.is_ObjectId = function (val) {
  return checkForHexRegExp.test( val );
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
    
    return 'mongodb://' + config.MongoDB.host + '/' + config.MongoDB.popit_prefix + name;
};


module.exports.mongo_native_connect = function (name) {
	var db = new mongodb(
      config.MongoDB.popit_prefix + name,
      new Server(config.MongoDB.host, config.MongoDB.port)
  );
  return db;
};

// delete a specific database
var delete_database = module.exports.delete_database = function delete_database ( name, cb ) {

    // winston.verbose( "Will delete " + name );
    
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


module.exports.delete_all_testing_databases = function (done_deleting_cb) {

    // sanity check
    if ( ! config.testing_config_loaded )
        throw new Error("Will not delete databases unless testing config has been loaded" );

    // what is our master db
    var popit_prefix = config.MongoDB.popit_prefix;
    var master_db_name = popit_prefix + config.MongoDB.master_name;
    
    // connect to the main database
    var db = new mongodb(
        master_db_name,
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
                    var testing_db_names = _.filter( master_db_names, function (name) { return name.indexOf(popit_prefix) === 0; });

                    cb( testing_db_names );
                });
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
                if (err) winston.error( err );
                db.close();
                done_deleting_cb(err);
            }
        );
    });
    
};

module.exports.load_test_fixtures = function (load_test_fixtures_done) {
    var master   = fixtures.connect( config.MongoDB.popit_prefix + config.MongoDB.master_name );
    var instance = fixtures.connect( config.MongoDB.popit_prefix + 'test' );

    master.load( '../fixtures/master.js', function () {
        instance.load( '../fixtures/test_instance.js', function () {
            master.client.close();
            instance.client.close();
            load_test_fixtures_done();            
        });
    });

};


module.exports.extract_slug = function extract_slug ( hostname ) {
    
    var index = hostname.indexOf( '.' );

    // if no match, or exact match
    if ( index < 0 ) return null;

    // get the string that matched
    return hostname.substring(0, index);    
};

module.exports.instance_base_url_from_slug = function instance_base_url_from_slug (slug) {
  return util.format( config.instance_server.base_url_format, slug );  
};

module.exports.checkDatabaseConnection = function () {
  var host = config.MongoDB.host + ':' + config.MongoDB.port;

  var errorMessage = function(err) {
    winston.error("\033[31mCan't connect to MongoDB server on "+host+" - is it running?\033[0m \n" + err);
  };

  // what is our master db
  var popit_prefix = config.MongoDB.popit_prefix;
  var master_db_name = popit_prefix + config.MongoDB.master_name;

  var db = new mongodb(
      master_db_name,
      new Server(config.MongoDB.host, config.MongoDB.port)
      );

  // check if ping returns an error
  db.open(function(err, db) {
    if (err) {
      errorMessage(err);
    } else {
      db.command({ping:1}, function(err, result) {
        if (err) {
          errorMessage(err);
        }
      });
    }
  });
};

module.exports.image_proxy_helper = function(url, height, width) {

  var Validator = require('validator').Validator;
  var v = new Validator();
  v.error = function(msg) {}; // To avoid validator from throwing error

  var options = (v.check(height).isNumeric()?"&height=" + height:"") + (v.check(width).isNumeric()?"&width=" + width:"");
  options += (options !== '') ? "&resize=1" : "";

  return config.image_proxy.path + "?url=" +  encodeURI(url) + options;
};
