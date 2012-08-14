
// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils         = require('../../lib/utils'),
    PopIt         = require('../../lib/popit'),
    MigrationApp  = require('../../lib/apps/migration');
    
var log = console.log;

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
    
    "database model for migration object": function ( test ) {
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

        var array = [ 'alpha', 'beta' ];
        migration.source.parsed.header = array;
        test.equal( migration.source.parsed.header.length, array.length, 'parsed source header changed' );

        var obj = {"0" : ["foo", "bar", "baz"]};
        migration.source.parsed.data = obj;
        test.deepEqual( migration.source.parsed.data, obj, 'parsed source data changed' );
        test.notDeepEqual( migration.source.parsed.data, {"1": ["foo"]}, 'parsed source data changed' );

        test.done();
    },

    "parse csv file": function ( test ) {
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
            'Last name': 'Doe'
          },
          'links': {
            'Twitter': '@funkyjohn',
            'Facebook': 'John Doe'
          }};

        var inverted = migration.zipIt(mappings, attributes);

        test.deepEqual(inverted, expect, 'correctly inverted');

        test.done();
    },

    "import two people": function ( test ) {
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
              [ 'birthdate', 'name', 'Birthdate' ],
              [ '', '', '' ]];
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
            '02/04/1900',
            ''],
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
            '01/10/2010',
            '']};

        var that = this;

        migration.doImport(that.popit, schema, mappings, data, function(){}, function(err, people) {
          
          if(err) 
            log(err);

          test.ifError(err);
          test.equal(people.length, 2, 'two people in people set');

          var query = that.popit.model('Person').find();

          query.exec(function(err, docs) {
            test.ifError(err);

            test.equal(docs.length, 2, 'two people in database');

            docs.forEach(function(doc) {
              test.equal(doc.links.length, 4, 'four links per person');
              test.equal(doc.contact_details.length, 1, 'one contact detail per person');
            });

            test.done();
          });
        });
    },

    "import the right fields": function ( test ) {
        test.expect( 26 );

        var migration = new MigrationApp();
        test.ok( migration, "got new migation app" );

        test.ok( migration.doImport, "migration tests" );

        schema = 'person';
        mappings = 
            [ [ 'title', 'name', 'Title' ],
              [ 'summary', 'summary', 'Summary' ],
              [ 'firstname', 'name', 'First name' ],
              [ 'middlename', 'name', 'Middle name' ],
              [ 'lastname', 'name', 'Last name' ],
              [ 'birthdate', 'name', 'Birthdate' ],
              [ 'party', 'position', 'Party' ],
              [ 'school', 'data', 'School' ],
              [ 'university', 'data', 'University' ],
              [ 'gender', 'data', 'Gender' ],
              [ 'phone', 'contact', 'Phone' ],
              [ 'fax', 'contact', 'Fax' ],
              [ 'website', 'links', 'Website' ],
              [ 'popit_id', 'id', 'PopIt' ],
              [ 'twitter_id', 'id', 'Twitter' ],
              [ 'wikipedia_url', 'links', 'Wikipedia' ],
              [ '', '', '' ]];
        data = {'675': 
          [ 'Sir',
            'The wonderful Sir John A. Doe',
            'John',
            'A.',
            'Doe',
            '14.10.1963',
            'Party of the Saussages',
            'Cucumber School',
            'Potatoe College',
            'Between',
            '734-234-3545',
            '',
            'http://www.doe.senate.gov/',
            'dsfd87g89dsfg6d5f7g8sfd6g8sdg8dfg',
            '@thedoe',
            'http://www.wikipedia.org/wiki/John_Doe',
            '']
          };

        var that = this;

        migration.doImport(this.popit, schema, mappings, data, function() {}, function(err, people) {
          
          if(err) 
            log(err);
          
          test.ifError(err);
          test.equal(people.length, 1, 'one person in people set');

          var query = that.popit.model('Person').find();

          query.exec(function(err, docs) {
            test.ifError(err);
            test.ok(docs);

            test.equal(docs.length, 1, 'one person in database');

            var p = docs[0];
            test.equal(p.name, "Sir John A. Doe");

            test.equal(p.summary, "The wonderful Sir John A. Doe");

            test.equal(p.links.length, 2);

            var el;
            el = _.filter(p.links, function(e) { return e.comment == "Website"});
            test.equal(el.length, 1);
            test.equal(el[0].url, 'http://www.doe.senate.gov/');

            el = _.filter(p.links, function(e) { return e.comment == "Wikipedia"});
            test.equal(el.length, 1);
            test.equal(el[0].url, 'http://www.wikipedia.org/wiki/John_Doe');

            var ids = p.get('ids');
            test.equal(ids.length, 2);

            var twitter = _.filter(ids, function(e) { return e.provider == "Twitter"});
            test.equal(twitter.length, 1);
            test.equal(twitter[0].id, '@thedoe');

            var popit = _.filter(ids, function(e) { return e.provider == "PopIt"});
            test.equal(popit.length, 1);
            test.equal(popit[0].id, 'dsfd87g89dsfg6d5f7g8sfd6g8sdg8dfg');


            test.equal(p.contact_details.length, 1);
            test.equal(p.contact_details[0].kind, "Phone");
            test.equal(p.contact_details[0].value, "734-234-3545");

            var data = p.get('data');
            test.equal(data.Gender, 'Between');
            test.equal(data.University, 'Potatoe College');
            test.equal(data.School, 'Cucumber School');

            test.equal(p.get('birthDate'), '14.10.1963');

            test.done();
          });
        });
    },

    "test update callback for import": function ( test ) {
        test.expect( 8 );

        var migration = new MigrationApp();
        test.ok( migration, "got new migation app" );

        test.ok( migration.doImport, "migration tests" );

        schema = 'person';
        mappings = 
            [ [ 'firstname', 'name', 'First name' ],
              [ 'lastname', 'name', 'Last name' ]];
        data = {'675': 
          [ 'John',
            'Doe'],
        '676': 
          [ 'Peter',
            'Johnson',
          ]};

        var that = this;
        var i = 1;

        migration.doImport(that.popit, schema, mappings, data, function(progress, total){
          test.equal(progress, i++);
          test.equal(total, 2);
        }, function(err, people) {
          test.ifError(err);
          test.equal(people.length, 2, 'two people in people set');
          test.done();
        });
    },

    "create organisation and position when importing a person": function ( test ) {
      test.expect( 7 );
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

      migration.doImport(that.popit, schema, mappings, data, function() {}, function(err, people, positions, organisations) {
        test.ifError(err);
        test.equal(organisations.length, 1, 'one organisation in organisations set');

        async.parallel([
          function(cb) {
            var query = that.popit.model('Position').find();
            query.exec(function(err, docs) {
              test.equal(docs.length, 1, 'one position in database');
              test.equal(docs[0].title, 'Party', 'right name for position');
              cb(err);
            });
          }, 
          function(cb) {
            var query = that.popit.model('Organisation').find();
            query.exec(function(err, docs) {
              test.equal(docs.length, 1, 'one organisation in database');
              test.equal(docs[0].name, 'Aliens', 'right name for position');
              cb(err);
            });
          }], 
          function(err) {
            test.ifError(err);
            test.done();
          })
      });
    },

    "handling of duplicate person slugs": function ( test ) {    
      test.expect( 3 );

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

      migration.doImport(that.popit, schema, mappings, data, function(){}, function(err, people){
        test.ifError(err, 'expect no error');
        test.equal(people.length, 3, 'three people in people set');

        var query = that.popit.model('Person').find();
        query.exec(function(err, docs) {
          test.equal(docs.length, 3, 'three people in database');
        });

        test.done();
      });
    },

    "handling of duplicate organisation slugs": function ( test ) {    
      test.expect( 3 );

      var migration = new MigrationApp();

      schema = 'person';
      mappings = 
        [ [ 'firstname', 'name', 'First name' ],
        [ 'party', 'position', 'Member' ] ];
      data = {
        '0': 
          [ 'John',
        'Dem' ],
        '1': 
          [ 'Peter',
        'Dem'],
        '2': 
          [ 'Paul',
        'Dem']};

      var that = this;

      migration.doImport(that.popit, schema, mappings, data, function(){}, function(err, people){
        test.ifError(err, 'expect no error');
        test.equal(people.length, 3, 'three people in people set');

        var query = that.popit.model('Organisation').find();
        query.exec(function(err, docs) {
          test.equal(docs.length, 1, 'one organisation in database');
          test.done();
        });
      });
    },

    "parse multiline csv": function ( test ) {
        test.expect( 3 );

        var migration = new MigrationApp();

        var realParsedCsv = { '0': [ 'name', ' email', ' links' ],
                              '1': [ 'foo', ' foo@mail.com', ' fo.co.uk' ],
                              '2': [ '', '', ' foo.de' ],
                              '3': [ 'bar', ' bar@mail.com', ' bar.co.uk' ] };
        migration.parseCsv(__dirname+"/sample_complex_csv.txt", function(parsed, err) {
          test.ifError(err);
          test.ok( parsed, "migration tests" );
          test.deepEqual( parsed, realParsedCsv, "migration tests" );

          test.done();

        });
    },

    "import multiline": function ( test ) {
        test.expect( 8 );

        var migration = new MigrationApp();

        test.ok( migration.doImport, "migration tests" );

        schema = 'person';
        mappings = 
            [ [ 'name', 'name', 'Full name' ],
              [ ' email', 'contact', 'Email' ],
              [ ' links', 'links', 'Website' ],
              [ ' random', 'data', 'Random' ] ];
        data = { '1': [ 'foo', ' foo@mail.com', ' fo.co.uk', 'orange' ],
                 '2': [ '', '', ' foo.de', 'blue' ],
                 '3': [ '', '', ' bar.de', '' ], 
                 '4': [ '', '', , 'purple' ]};

        var that = this;

        migration.doImport(that.popit, schema, mappings, data, function(){}, function(err, people) {
          
          if(err) 
            log(err);

          test.ifError(err);
          test.equal(people.length, 1, 'one person in people set');

          var query = that.popit.model('Person').find();

          query.exec(function(err, docs) {
            test.ifError(err);

            test.equal(docs.length, 1, 'one person in database');

            docs.forEach(function(doc) {
              test.equal(doc.links.length, 3, 'three links');
              test.equal(doc.get('data').Random.length, 3, 'two random in data');
              test.equal(doc.contact_details.length, 1, 'one contact detail');
            });

            test.done();
          });
        });
    },
};
