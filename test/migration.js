"use strict";

var assert = require('assert');
var _ = require('underscore');
var async = require('async');
var utils = require('../lib/utils');
var PopIt = require('../lib/popit');
var MigrationApp = require('../lib/apps/migration');

describe("migration tool", function() {
  var popit;
  var Migration;

  beforeEach(function() {
    popit = new PopIt();
    popit.set_instance('test');
    Migration = popit.model('Migration');
  });

  beforeEach(utils.delete_all_testing_databases);

  it("database model for migration object", function() {
    var migration = new Migration();
    assert(migration, "got new migation");

    // initial settings
    assert.equal(migration.created, Date(), 'current date');
    assert.equal(migration.source.name, null, 'empty source name');
    assert.equal(migration.source.mime_type, null, 'empty source mime_type');
    assert.equal(migration.source.parsed.header.length, 0, 'empty parsed source header');
    assert.equal(migration.source.parsed.data, null, 'empty parsed source data');

    migration.source.name = "TestSource";
    assert.equal(migration.source.name, "TestSource", 'source name changed');

    migration.source.mime_type = "text/csv";
    assert.equal(migration.source.mime_type, "text/csv", 'source mime_type changed');

    var array = ['alpha', 'beta'];
    migration.source.parsed.header = array;
    assert.equal(migration.source.parsed.header.length, array.length, 'parsed source header changed');

    var obj = {"0" : ["foo", "bar", "baz"]};
    migration.source.parsed.data = obj;
    assert.deepEqual(migration.source.parsed.data, obj, 'parsed source data changed');
    assert.notDeepEqual(migration.source.parsed.data, {"1": ["foo"]}, 'parsed source data changed');
  });

  it("parse csv file", function(done) {
    var migration = new MigrationApp();
    assert(migration, "got new migation app");

    assert(migration.parseCsv, "migration tests");

    var realParsedCsv = {
      '0': ['a', 'b', 'c'],
      '1': [' foo\t', ' bar'],
      '2': ['%*', ' ä', ' ßßß', ' ']
    };

    migration.parseCsv(__dirname + "/fixtures/sample_csv.txt", function(err, parsed) {
      assert.ifError(err);
      assert(parsed, "migration tests");
      assert.deepEqual(parsed, realParsedCsv, "migration tests");

      done();
    });
  });

  it("array to inverted dictionary", function () {
    var migration = new MigrationApp();
    assert(migration, "got new migation app");

    assert(migration.zipIt, "migration tests");

    var mappings = [
      [ 'firstname', 'name', 'First name' ],
      [ 'middlename', 'name', 'Middle name' ],
      [ 'lastname', 'name', 'Last name' ],
      [ 'twitter', 'links', 'Twitter' ],
      [ 'facebook', 'links', 'Facebook' ]
    ];

    var attributes = [
      'John',
      'Peter',
      'Doe',
      '@funkyjohn',
      'John Doe'
    ];

    var expect = {
      'name': {
        'First name': 'John',
        'Middle name': 'Peter',
        'Last name': 'Doe'
      },
      'links': {
        'Twitter': '@funkyjohn',
        'Facebook': 'John Doe'
      }
    };

    var inverted = migration.zipIt(mappings, attributes);

    assert.deepEqual(inverted, expect, 'correctly inverted');
  });

  it("import two people", function(done) {
    var migration = new MigrationApp();
    assert(migration, "got new migation app");

    assert(migration.doImport, "migration tests");

    var schema = 'person';

    var mappings = [
      [ 'title', 'name', 'Title' ],
      [ 'firstname', 'name', 'First name' ],
      [ 'middlename', 'name', 'Middle name' ],
      [ 'lastname', 'name', 'Last name' ],
      [ 'name_suffix', 'name', 'Name suffix' ],
      [ 'nickname', '', '' ],
      [ 'party', 'membership', 'Party' ],
      [ 'state', '', '' ],
      [ 'district', '', '' ],
      [ 'in_office', '', '' ],
      [ 'gender', '', '' ],
      [ 'phone', 'contact', 'voice' ],
      [ 'fax', 'contact', 'fax' ],
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
      [ '', '', '' ]
    ];

    var data = {
      '675': [
        'Sen',
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
        ''
      ],
      '676': [
        'Sen',
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
        ''
      ]
    };

    migration.doImport(popit, schema, mappings, data, function() {}, function(err, people) {
      assert.ifError(err);
      assert.equal(people.length, 2, 'two people in people set');

      popit.model('Person').find(function(err, docs) {
        assert.ifError(err);

        assert.equal(docs.length, 2, 'two people in database');

        docs.forEach(function(doc) {
          assert.equal(doc.links.length, 4, 'four links per person');
          assert.equal(doc.contact_details.length, 1, 'one contact detail per person');
        });
        done();
      });
    });
  });

  it("import the right fields", function(done) {
    var migration = new MigrationApp();
    assert(migration, "got new migation app");

    assert(migration.doImport, "migration tests");

    var schema = 'person';

    var mappings = [
      [ 'title', 'name', 'Title' ],
      [ 'summary', 'summary', 'Summary' ],
      [ 'firstname', 'name', 'First name' ],
      [ 'middlename', 'name', 'Middle name' ],
      [ 'lastname', 'name', 'Last name' ],
      [ 'birthdate', 'name', 'Birthdate' ],
      [ 'party', 'membership', 'Party' ],
      [ 'school', 'data', 'School' ],
      [ 'university', 'data', 'University' ],
      [ 'gender', 'data', 'Gender' ],
      [ 'phone', 'contact', 'voice' ],
      [ 'fax', 'contact', 'fax' ],
      [ 'website', 'links', 'Website' ],
      [ 'popit_id', 'id', 'PopIt' ],
      [ 'twitter_id', 'id', 'Twitter' ],
      [ 'wikipedia_url', 'links', 'Wikipedia' ],
      [ '', '', '' ]
    ];

    var data = {
      '675': [
        'Sir',
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
        ''
      ]
    };

    migration.doImport(popit, schema, mappings, data, function() {}, function(err, people) {
      assert.ifError(err);
      assert.equal(people.length, 1, 'one person in people set');

      popit.model('Person').find(function(err, docs) {
        assert.ifError(err);
        assert(docs);

        assert.equal(docs.length, 1, 'one person in database');

        var p = docs[0];
        assert.equal(p.name, "Sir John A. Doe");
        assert.equal(p.summary, "The wonderful Sir John A. Doe");
        assert.equal(p.links.length, 2);

        var el;
        el = _.filter(p.links, function(e) { return e.note == "Website"; });
        assert.equal(el.length, 1);
        assert.equal(el[0].url, 'http://www.doe.senate.gov/');

        el = _.filter(p.links, function(e) { return e.note == "Wikipedia"; });
        assert.equal(el.length, 1);
        assert.equal(el[0].url, 'http://www.wikipedia.org/wiki/John_Doe');

        var ids = p.get('ids');
        assert.equal(ids.length, 2);

        var twitter = _.filter(ids, function(e) { return e.provider == "Twitter"; });
        assert.equal(twitter.length, 1);
        assert.equal(twitter[0].id, '@thedoe');

        var popit = _.filter(ids, function(e) { return e.provider == "PopIt"; });
        assert.equal(popit.length, 1);
        assert.equal(popit[0].id, 'dsfd87g89dsfg6d5f7g8sfd6g8sdg8dfg');


        assert.equal(p.contact_details.length, 1);
        assert.equal(p.contact_details[0].type, "voice");
        assert.equal(p.contact_details[0].value, "734-234-3545");

        var data = p.get('data');
        assert.equal(data.Gender, 'Between');
        assert.equal(data.University, 'Potatoe College');
        assert.equal(data.School, 'Cucumber School');

        assert.equal(p.get('birthDate'), '14.10.1963');

        done();
      });
    });
  });

  it("test update callback for import", function(done) {
    var migration = new MigrationApp();
    assert(migration, "got new migation app");

    assert(migration.doImport, "migration tests");

    var schema = 'person';

    var mappings = [
      [ 'firstname', 'name', 'First name' ],
      [ 'lastname', 'name', 'Last name' ]
    ];

    var data = {
      '675': [
        'John',
        'Doe'
      ],
      '676': [
        'Peter',
        'Johnson',
      ]
    };

    var i = 1;

    migration.doImport(popit, schema, mappings, data, function(progress, total) {
      assert.equal(progress, i++);
      assert.equal(total, 2);
    }, function(err, people) {
      assert.ifError(err);
      assert.equal(people.length, 2, 'two people in people set');
      done();
    });
  });

  it("create organization and membership when importing a person", function(done) {
    var migration = new MigrationApp();

    var schema = 'person';

    var mappings = [
      [ 'firstname', 'name', 'First name' ],
      [ 'lastname', 'name', 'Last name' ],
      [ 'party', 'membership', 'Party' ]
    ];

    var data = {
      '675': [
        'John',
        'Doe',
        'Aliens'
      ]
    };

    migration.doImport(popit, schema, mappings, data, function() {}, function(err, people, memberships, organizations) {
      assert.ifError(err);
      assert.equal(organizations.length, 1, 'one organization in organizations set');

      async.parallel([
        function(cb) {
        popit.model('Membership').find(function(err, docs) {
          assert.ifError(err);
          assert.equal(docs.length, 1, 'one membership in database');
          assert.equal(docs[0].role, 'Party', 'right name for membership');
          popit.model('Person').findOne(function(err, person) {
            assert.ifError(err);
            assert.equal(docs[0].person_id, person._id, 'correct id for person');
            cb(err);
          });
        });
      },
      function(cb) {
        popit.model('Organization').find(function(err, docs) {
          assert.ifError(err);
          assert.equal(docs.length, 1, 'one organization in database');
          assert.equal(docs[0].name, 'Aliens', 'right name for membership');
          cb(err);
        });
      }],
      function(err) {
        assert.ifError(err);
        done();
      });
    });
  });

  it("handles duplicate person slugs", function(done) {
    var migration = new MigrationApp();

    var schema = 'person';

    var mappings = [
      [ 'firstname', 'name', 'First name' ],
      [ 'lastname', 'name', 'Last name' ]
    ];

    var data = {
      '675': [
        'John',
        'Doe'
      ],
      '676': [
        'John',
        'Doe'
      ],
      '677': [
        'John',
        'Doe'
      ]
    };

    migration.doImport(popit, schema, mappings, data, function() {}, function(err, people) {
      assert.ifError(err);
      assert.equal(people.length, 3, 'three people in people set');

      popit.model('Person').find(function(err, docs) {
        assert.ifError(err);
        assert.equal(docs.length, 3, 'three people in database');

        done();
      });
    });
  });

  it("handling of duplicate organization slugs", function(done) {
    var migration = new MigrationApp();

    var schema = 'person';

    var mappings = [
      [ 'firstname', 'name', 'First name' ],
      [ 'party', 'membership', 'Member' ]
    ];

    var data = {
      '0': [
        'John',
        'Dem'
      ],
      '1': [
        'Peter',
        'Dem'
      ],
      '2': [
        'Paul',
        'Dem'
      ]
    };

    migration.doImport(popit, schema, mappings, data, function() {}, function(err, people){
      assert.ifError(err);
      assert.equal(people.length, 3, 'three people in people set');

      popit.model('Organization').find(function(err, docs) {
        assert.ifError(err);
        assert.equal(docs.length, 1, 'one organization in database');
        done();
      });
    });
  });

  it("parse multiline csv", function(done) {
    var migration = new MigrationApp();

    var realParsedCsv = {
      '0': ['name', ' email', ' links'],
      '1': ['foo', ' foo@mail.com', ' fo.co.uk'],
      '2': ['', '', ' foo.de'],
      '3': ['bar', ' bar@mail.com', ' bar.co.uk'],
      '4': ['D’Angelo “Oddball” Fritz', ' oddball@example.com', ' example.com']
    };

    migration.parseCsv(__dirname + "/fixtures/sample_multiline.csv", function(err, parsed) {
      assert.ifError(err);
      assert(parsed, "migration tests");
      assert.deepEqual(parsed, realParsedCsv, "migration tests");

      done();
    });
  });

  it("import multiline", function(done) {
    var migration = new MigrationApp();

    assert(migration.doImport, "migration tests");

    var schema = 'person';

    var mappings = [
      [ 'name', 'name', 'Full name' ],
      [ ' email', 'contact', 'Email' ],
      [ ' links', 'links', 'Website' ],
      [ ' random', 'data', 'Random' ]
    ];

    var data = {
      '1': ['foo', ' foo@mail.com', ' fo.co.uk', 'orange'],
      '2': ['', '', ' foo.de', 'blue'],
      '3': ['', '', ' bar.de', ''],
      '4': ['', '', , 'purple']
    };

    migration.doImport(popit, schema, mappings, data, function() {}, function(err, people) {
      assert.ifError(err);
      assert.equal(people.length, 1, 'one person in people set');

      popit.model('Person').find(function(err, docs) {
        assert.ifError(err);

        assert.equal(docs.length, 1, 'one person in database');

        docs.forEach(function(doc) {
          assert.equal(doc.links.length, 3, 'three links');
          assert.equal(doc.get('data').Random.length, 3, 'two random in data');
          assert.equal(doc.contact_details.length, 1, 'one contact detail');
        });

        done();
      });
    });
  });

  it("import curly punctuation name", function(done) {
    var migration = new MigrationApp();

    assert( migration.doImport, "migration tests" );

    var schema = 'person';

    var mappings = [
      [ 'name', 'name', 'Full name' ]
    ];

    var data = {
      '1': [ 'D’Angelo “Oddball” Fritz' ]
    };

    migration.doImport(popit, schema, mappings, data, function(){}, function(err, people) {
      assert.ifError(err);
      assert.equal(people.length, 1, 'one person in people set');

      popit.model('Person').find(function(err, docs) {
        assert.ifError(err);

        assert.equal(docs.length, 1, 'one person in database');

        docs.forEach(function(doc) {
          assert.equal(doc.name, 'D’Angelo “Oddball” Fritz', 'D’Angelo “Oddball” Fritz');
        });

        done();
      });
    });
  });
});
