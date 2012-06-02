
// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils         = require('../../lib/utils'),
    PopIt         = require('../../lib/popit'),
    MigrationApp  = require('../../lib/apps/migration');
    
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
        test.expect( 11 );
        
        var migration = new this.Migration();
        test.ok( migration, "got new migation" );

        // initial settings
        test.equal( migration.created, Date(), 'current date' );
        test.equal( migration.source.name, null, 'empty source name' );
        test.equal( migration.source.mime_type, null, 'empty source mime_type' );
        test.equal( migration.source.parsed.header.length, 0, 'empty parsed source header' );
        test.equal( migration.source.parsed.data, null, 'empty parsed source data' );

        migration.source.name ="FooBar";
        test.equal( migration.source.name, "FooBar", 'source name changed' );

        migration.source.mime_type ="text/csv";
        test.equal( migration.source.mime_type, "text/csv", 'source mime_type changed' );

        var array = [ 'alpha', 'beta' ]
        migration.source.parsed.header = array;
        test.equal( migration.source.parsed.header.length, array.length, 'parsed source header changed' );

        var obj = {"0" : ["foo", "bar", "baz"]};
        migration.source.parsed.data = obj;
        test.deepEqual( migration.source.parsed.data, obj, 'parsed source data changed' );
        test.notDeepEqual( migration.source.parsed.data, {"1": ["foo"]}, 'parsed source data changed' );

        test.done();
    },

    "migration parse csv": function ( test ) {    
        test.expect( 5 );

        var migration = new MigrationApp();
        test.ok( migration, "got new migation app" );

        test.ok( migration.parseCsv, "migration tests" );

        var realParsedCsv = { '0': [ 'a', 'b', 'c' ],
                              '1': [ ' foo\t', ' bar' ],
                              '2': [ '%*', ' ä', ' ßßß', ' ' ] };
        migration.parseCsv(__dirname+"/sample_csv.txt", function(parsed, err) {
          test.ifError(err);
          test.ok( parsed, "migration tests" );
          test.deepEqual( parsed, realParsedCsv, "migration tests" );
        });

        // test if method exists

        test.done();
    }

};
