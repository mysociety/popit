"use strict";

var assert = require('assert');
var utils = require('../lib/utils');
var PopIt = require('../lib/popit');
var async = require('async');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

describe("person", function() {
  var popit;
  var Person;

  beforeEach(function() {
    popit = new PopIt();
    popit.set_instance('test');
    Person = popit.model('Person');
  });

  beforeEach(utils.delete_all_testing_databases);

  it("person name", function() {
    var person = new Person();
    assert(person, "got new person");

    // initial settings
    assert.equal(person.name, null, 'no name');

    // set a valid name
    person.name = "Joé Blöggs";
    assert.equal(person.name, "Joé Blöggs", 'name set');
  });

  it("name searching", function(done) {
    var joe;

    async.series([
      // search for person called joe (no matches)
      function (cb) {
        Person.name_search('joe', function (err,docs) {
          assert.equal( docs.length, 0, "no matches when no rows" );
          cb(err);
        });
      },

      // create joe
      function (cb) {
        // create joe
        joe = new Person({name: 'Joe', _id: new ObjectId() });
        joe.save(cb);
      },

      // search for person called joe (find one)
      function (cb) {
        Person.name_search('joe', function (err, docs) {
          assert.equal( docs.length, 1, "find joe we just inserted" );
          assert.equal( docs[0]._id, joe._id );
          cb(err);
        });
      },

      // rename joe to Fred
      function (cb) {
        joe.name = 'Fred';
        joe.save(cb);
      },

      // search for person called joe (no matches)
      function (cb) {
        Person.name_search('joe', function (err,docs) {
          assert.equal( docs.length, 0, "Now not found" );
          cb(err);
        });
      },

    ],
    function (err) {
      assert.ifError(err);
      done();
    }
    );
  });
});
