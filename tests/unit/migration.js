
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

          test.done();

        });
    },

     "inversion": function ( test ) {    
        test.expect( 3 );

        var migration = new MigrationApp();
        test.ok( migration, "got new migation app" );

        test.ok( migration.invert, "migration tests" );

        var mappings =  [[ 'firstname', 'name', 'First name' ],
            [ 'middlename', 'name', 'Middle name' ],
            [ 'lastname', 'name', 'Last name' ],
            [ 'twitter', 'link', 'Twitter' ],
            [ 'facebook', 'link', 'Facebook' ]];
        var attributes = [ 'John',
            'Peter',
            'Doe',
            '@funkyjohn',
            'John Doe'];

        var expect = {
          'name': {
            'First name': 'John', 
            'Middle name': 'Peter', 
            'Last name': 'Doe'},
          'link': {
            'Twitter': '@funkyjohn',
            'Facebook': 'John Doe'
          }};

        var inverted = migration.invert(mappings, attributes);

        test.deepEqual(inverted, expect, 'correctly inverted');

        test.done();
    },

    "migration import": function ( test ) {    
        test.expect( 6 );

        var migration = new MigrationApp();
        test.ok( migration, "got new migation app" );

        test.ok( migration.doImport, "migration tests" );

        schema = 'person';
        mappings = 
            [ [ 'title', 'name', 'Title' ],
              [ 'firstname', 'name', 'First name' ],
              [ 'middlename', 'name', 'Middle name' ],
              [ 'lastname', 'name', 'Last name' ],
              [ 'name_suffix', 'name', 'Name suffix' ],
              [ 'nickname', '', '' ],
              [ 'party', 'organization', 'Party' ],
              [ 'state', '', '' ],
              [ 'district', '', '' ],
              [ 'in_office', '', '' ],
              [ 'gender', '', '' ],
              [ 'phone', 'contact', 'Phone' ],
              [ 'fax', 'contact', 'Fax' ],
              [ 'website', 'link', 'Website' ],
              [ 'webform', '', '' ],
              [ 'congress_office', '', '' ],
              [ 'bioguide_id', '', '' ],
              [ 'votesmart_id', '', '' ],
              [ 'fec_id', '', '' ],
              [ 'govtrack_id', '', '' ],
              [ 'crp_id', '', '' ],
              [ 'twitter_id', 'id', 'Twitter' ],
              [ 'congresspedia_url', '', '' ],
              [ 'youtube_url', 'link', 'Youtube' ],
              [ 'facebook_id', '', '' ],
              [ 'official_rss', '', '' ],
              [ 'senate_class', '', '' ],
              [ 'birthdate', 'name', 'Birtdate' ] ];
        data = {'675': 
          [ 'Sen',
            'John',
            'A.',
            'Doe',
            '',
            '',
            'R',
            'SD',
            'Junior Seat',
            '1',
            'M',
            '734-234-3545',
            '734-234-3545',
            'http://www.doe.senate.gov/',
            'http://www.doe.senate.gov/public/index.cfm/contact',
            'Office Building',
            '56456',
            '123',
            'S2SD00068',
            '400546',
            'N00044342',
            '@thedoe',
            'http://www.opencongress.org/wiki/John_Doe',
            'http://www.youtube.com/JohnDoe',
            '63002536261',
            '',
            'III',
            '02/04/1900' ],
        '676': 
          [ 'Sen',
            'Peter',
            'L.',
            'Johnson',
            '',
            '',
            'D',
            'SD',
            'Junior Seat',
            '1',
            'M',
            '734-234-3547',
            '734-234-3548',
            'http://www.johnson.senate.gov/',
            'http://www.johnson.senate.gov/public/index.cfm/contact',
            'Office Building',
            '6564566',
            '3456',
            '34566634',
            '400546',
            'N2356546',
            '@mrsen',
            'http://www.opencongress.org/wiki/Peter_Johnsson',
            'http://www.youtube.com/PeterJohnsson',
            '63002536261',
            '',
            'II',
            '01/10/2010' ]};

        var that = this;

        // TODO test errors

        migration.doImport(that.popit, schema, mappings, data, function(err, people){
          test.ifError(err);
          test.equal(people.length, 2, 'two people in people set');

          var query = that.popit.model('Person').find().asc('name');

          query.run(function(err, docs) {
            test.ifError(err);

            console.log(docs);
            test.equal(docs.length, 2, 'two people in database');

            test.done();
          });
        });
    }

};
