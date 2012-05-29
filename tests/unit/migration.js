
// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils    = require('../../lib/utils'),
    PopIt    = require('../../lib/popit');
    
module.exports = {
    
    setUp: function(cb) {
        this.popit  = new PopIt();
        this.popit.set_instance('test');
        this.Migration = this.popit.model('Migration');
        
        utils.delete_all_testing_databases(cb);
    },
    
    tearDown: function(cb) {
        // close the connections so that the test script can exit
        this.popit.close_db_connections(cb);
    },
    
    "migration database model": function ( test ) {    
        test.expect( 9 );
        
        var migration = new this.Migration();
        test.ok( migration, "got new migation" );

        // initial settings
        test.equal( migration.created, Date(), 'current date' );
        test.equal( migration.source.name, null, 'empty source name' );
        test.equal( migration.source.mime_type, null, 'empty source mime_type' );
        test.equal( migration.source.parsed, null, 'empty parsed source' );

        migration.source.name ="FooBar";
        test.equal( migration.source.name, "FooBar", 'source name changed' );

        migration.source.mime_type ="text/csv";
        test.equal( migration.source.mime_type, "text/csv", 'source mime_type changed' );

        var obj = {"0" : ["foo", "bar", "baz"]};
        migration.source.parsed = obj;
        test.equal( migration.source.parsed, obj, 'parsed source changed' );
        test.notEqual( migration.source.parsed, {"1": ["foo"]}, 'parsed source changed' );

        test.done();
    }
};
