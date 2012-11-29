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
    
    "get positions from person (with cb)": function ( test ) {    
        test.expect( 4 );

        this.popit.model('Person').findOne({slug: 'barack-obama'}, function(err, obama) {
          if (err) throw err;
          
          test.equal( obama.name, "Barack Obama", "Got Obama");
        
          obama.find_positions(function(err, positions) {
            test.ifError(err);
            test.equal( positions.length, 1, "count positions");
            test.equal( positions[0].title, "President", "is president");
            test.done();
          });        
        });        
    },
    
    "get positions from person (without cb)": function ( test ) {    
        test.expect( 4 );

        this.popit.model('Person').findOne({slug: 'barack-obama'}, function(err, obama) {
          if (err) throw err;
          test.equal( obama.name, "Barack Obama", "Got Obama");

          var positions = obama.find_positions();
        
          positions.exec(function(err, positions) {

            test.ifError(err);

            test.equal( positions.length, 1, "count positions");
            test.equal( positions[0].title, "President", "is president");
            test.done();
          });        
        });        
    },
    
    "get positions from organisation": function ( test ) {    
        test.expect( 3 );

        this.popit.model('Organisation').findOne({slug: 'united-states-government'}, function(err, usg) {
          if (err) throw err;
          test.equal( usg.name, "United States Government", "Got USG");

          usg.find_positions(function(err, positions) {
            test.ifError(err);
            test.equal( positions.length, 4, "count positions");
            test.done();
          });        
        });        
    },
    
    
};