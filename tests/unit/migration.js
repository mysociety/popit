
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
    
    "database model": function ( test ) {
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

    "parse csv": function ( test ) {
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

     "array to inverted dictionary": function ( test ) {
        test.expect( 3 );

        var migration = new MigrationApp();
        test.ok( migration, "got new migation app" );

        test.ok( migration.zipIt, "migration tests" );

        var mappings =  [[ 'firstname', 'name', 'First name' ],
            [ 'middlename', 'name', 'Middle name' ],
            [ 'lastname', 'name', 'Last name' ],
            [ 'twitter', 'links', 'Twitter' ],
            [ 'facebook', 'links', 'Facebook' ]];
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
          'links': {
            'Twitter': '@funkyjohn',
            'Facebook': 'John Doe'
          }};

        var inverted = migration.zipIt(mappings, attributes);

        test.deepEqual(inverted, expect, 'correctly inverted');

        test.done();
    },

    "import of two people": function ( test ) {
        test.expect( 10 );

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
              [ 'party', 'position', 'Party' ],
              [ 'state', '', '' ],
              [ 'district', '', '' ],
              [ 'in_office', '', '' ],
              [ 'gender', '', '' ],
              [ 'phone', 'contact', 'Phone' ],
              [ 'fax', 'contact', 'Fax' ],
              [ 'website', 'links', 'Website' ],
              [ 'webform', 'links', 'Webform' ],
              [ 'congress_office', '', '' ],
              [ 'bioguide_id', '', '' ],
              [ 'votesmart_id', '', '' ],
              [ 'fec_id', '', '' ],
              [ 'govtrack_id', '', '' ],
              [ 'crp_id', '', '' ],
              [ 'twitter_id', 'id', 'Twitter' ],
              [ 'congresspedia_url', 'links', 'congresspedia' ],
              [ 'youtube_url', 'links', 'Youtube' ],
              [ 'facebook_id', 'id', 'Facebook' ],
              [ 'official_rss', 'links', 'RSS' ],
              [ 'senate_class', '', '' ],
              [ 'birthdate', 'name', 'Birthdate' ] ];
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
            '',
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
            '',
            'http://www.johnson.senate.gov/',
            'http://www.johnson.senate.gov/public/index.cfm/contact',
            'Office Building',
            '6564566',
            '3456',
            '34566634',
            '400546',
            'N2356546',
            '@mrsen',
            '',
            'http://www.youtube.com/PeterJohnsson',
            '63002536261',
            'http://www.test.co.uk/rssfeed',
            'II',
            '01/10/2010' ]};

        var that = this;

        migration.doImport(that.popit, schema, mappings, data, function(err, people) {
          test.ifError(err);
          test.equal(people.length, 2, 'two people in people set');

          var query = that.popit.model('Person').find();

          query.run(function(err, docs) {
            test.ifError(err);

            test.equal(docs.length, 2, 'two people in database');

            docs.forEach(function(doc) {
              test.equal(doc.links.length, 4, 'four links per person');
              test.equal(doc.contact_details.length, 1, 'one contact detail per person');
            })

            test.done();
          });
        });
    },

    "create organisation and position when importing a person": function ( test ) {
      test.expect( 5 );
      var migration = new MigrationApp();

      schema = 'person';
      mappings = [
        [ 'firstname', 'name', 'First name' ],
        [ 'lastname', 'name', 'Last name' ],
        [ 'party', 'position', 'Party' ] ];
      data = {'675':
        [ 'John',
          'Doe',
          'Aliens']};

      var that = this;

      migration.doImport(that.popit, schema, mappings, data, function(err, people, positions, organisations) {
        test.ifError(err);
        test.equal(organisations.length, 1, 'one organisation in organisations set');

        async.parallel([
          function(cb) {
            var query = that.popit.model('Position').find();
            query.run(function(err, docs) {
              test.equal(docs.length, 1, 'one position in database');
              cb(err);
            });
          }, 
          function(cb) {
            var query = that.popit.model('Organisation').find();
            query.run(function(err, docs) {
              test.equal(docs.length, 1, 'one organisation in database');
              cb(err);
            });
          }], 
          function(err) {
            test.ifError(err);
            test.done();
          })
      });
    },

    "handling of duplicate slugs": function ( test ) {    
      test.expect( 2 );

      var migration = new MigrationApp();

      schema = 'person';
      mappings = 
        [ [ 'firstname', 'name', 'First name' ],
        [ 'lastname', 'name', 'Last name' ] ];
      data = {
        '675': 
          [ 'John',
        'Doe' ],
        '676': 
          [ 'John',
        'Doe'],
        '677': 
          [ 'John',
        'Doe']};

      var that = this;

      migration.doImport(that.popit, schema, mappings, data, function(err, people){
        test.ifError(err, 'expect no error');
        test.equal(people.length, 3, 'three people in people set');

        var query = that.popit.model('Person').find().asc('name');

        test.done();
      });
    }
};
