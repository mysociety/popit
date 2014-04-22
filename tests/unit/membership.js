"use strict"; 


// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils    = require('../../lib/utils'),
    PopIt    = require('../../lib/popit');
    
module.exports = {
    
    setUp: function(cb) {

        var self = this;
        
        var popit = this.popit  = new PopIt();
        popit.set_instance('test');
        
        utils.delete_all_testing_databases( function() {
          utils.load_test_fixtures( function () {
            cb();
          });
        });
    },
    
    tearDown: function(cb) {
        // close the connections so that the test script can exit
        this.popit.close_db_connections(cb);
    },
    
    "get memberships from person (with cb)": function ( test ) {    
        test.expect( 4 );

        this.popit.model('Person').findOne({_id: 'barack-obama'}, function(err, obama) {
          if (err) throw err;
          
          test.equal( obama.name, "Barack Obama", "Got Obama");
        
          obama.find_memberships(function(err, memberships) {
            test.ifError(err);
            test.equal( memberships.length, 1, "count memberships");
            test.equal( memberships[0].role, "President", "is president");
            test.done();
          });        
        });        
    },
    
    "get memberships from person (without cb)": function ( test ) {    
        test.expect( 4 );

        this.popit.model('Person').findOne({_id: 'barack-obama'}, function(err, obama) {
          if (err) throw err;
          test.equal( obama.name, "Barack Obama", "Got Obama");

          var memberships = obama.find_memberships();
        
          memberships.exec(function(err, memberships) {

            test.ifError(err);

            test.equal( memberships.length, 1, "count memberships");
            test.equal( memberships[0].role, "President", "is president");
            test.done();
          });        
        });        
    },
    
    "get memberships from organization": function ( test ) {    
        test.expect( 3 );

        this.popit.model('Organization').findOne({_id: 'united-states-government'}, function(err, usg) {
          if (err) throw err;
          test.equal( usg.name, "United States Government", "Got USG");

          usg.find_memberships(function(err, memberships) {
            test.ifError(err);
            test.equal( memberships.length, 4, "count memberships");
            test.done();
          });        
        });        
    },
    
    
};
