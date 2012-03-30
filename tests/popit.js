
// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils    = require('../lib/utils'),
    PopIt    = require('../lib/popit'),
    _        = require('underscore'),
    async    = require('async');

module.exports = {
    
    setUp: function(cb) {
        this.popit = new PopIt();
        utils.delete_all_testing_databases(cb);
    },
    
    tearDown: function(cb) {
        // cose the connections so that the test script can exit
        this.popit.close_db_connections();
        cb(null);
    },
    
    "get general database handle": function ( test ) {    
        test.expect( 1 );

        var popit = this.popit;

        var master_db = popit.master_db();
        test.ok( master_db, "got a connection to the master db" );

        test.done();
    },
    
    "get an instance specific database": function (test) {
        test.expect( 3 );

        var popit = this.popit;

        // check that if we have not set the instance we get an error

        test.throws(
            function() { popit.instance_db() },
            'foo',
            'throw exception if instance not configured'
        );

        test.ok( popit.set_instance( 'foobar' ), 'set the instance' );

        test.ok( popit.instance_db(), "got a connection to the foobar instance" );

        test.done();
    },

    "check that we can get a model": function (test) {
        test.expect(8);
        
        var popit = this.popit;
        popit.set_instance('foobar');

        // try to get a model that does not exist
        test.throws(
            function () { popit.model('does_not_exist') },
            /Could not find a schema for does_not_exist/,
            "throw error for non-existent schema"
        );

        var userModel = popit.model('User');
        test.ok( userModel, "got a model for User" );
        
        test.strictEqual( popit.model('User'), userModel, "get a cached model" );
        
        var user      = new userModel({
            email:           "bob@example.com",
            hashed_password: "secret_hash",
        });
        
        test.ok( user, "have a user" );

        user.save( function ( err, object ) {

            // check that the user was saved
            test.ifError(err, "no error saving");
            test.equal(object.id, user.id, "IDs are the same");
            
            userModel.findOne({email: user.email}, function(err, retrieved_user) {
                test.ifError(err, "no error retrieving");
                test.ok(retrieved_user, "Found user in database");
                test.done();
            });
            
            
        });
        
    },
};