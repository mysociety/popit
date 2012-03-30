
// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils    = require('../lib/utils'),
    PopIt    = require('../lib/popit'),
    _        = require('underscore'),
    async    = require('async');

module.exports = {
    
    setUp: function(cb) {
        this.popit = new PopIt();
        cb(null);
    },
    
    tearDown: function(cb) {
        // cose the connections so that the test script can exit
        this.popit.close_db_connections();
        cb(null);
    },
    
    "get general database handle": function ( test ) {    
        test.expect( 1 );

        var popit = this.popit;

        var all_db = popit.all_db();
        test.ok( all_db, "got a connection to the all db" );

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
};