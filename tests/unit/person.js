"use strict"; 


// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils    = require('../../lib/utils'),
    PopIt    = require('../../lib/popit'),
    async    = require('async'),
    mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;
    
module.exports = {
    
    setUp: function(cb) {
        this.popit  = new PopIt();
        this.popit.set_instance('test');
        this.Person = this.popit.model('Person');
        
        utils.delete_all_testing_databases(cb);
    },
    
    tearDown: function(cb) {
        // close the connections so that the test script can exit
        this.popit.close_db_connections(cb);
    },
    "name searching": function (test) {
      var Person = this.Person;
      test.expect(5);

      var joe = null;

      async.series(
        [
          // search for person called joe (no matches)
          function (cb) {
            Person.name_search('joe', function (err,docs) {
              test.equal( docs.length, 0, "no matches when no rows" );
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
              test.equal( docs.length, 1, "find joe we just inserted" );
              test.equal( docs[0]._id, joe._id );
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
              test.equal( docs.length, 0, "Now not found" );
              cb(err);
            });
          },
          
        ],
        function (err) {
          test.ifError(err);
          test.done();
        }
      );
    },
};
