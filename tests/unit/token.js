
// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils    = require('../../lib/utils'),
    PopIt    = require('../../lib/popit');
    
module.exports = {
    
    setUp: function(cb) {
        this.popit  = new PopIt();
        this.popit.set_instance('test');
        this.Token = this.popit.model('Token');
        
        utils.delete_all_testing_databases(cb);
    },
    
    tearDown: function(cb) {
        // close the connections so that the test script can exit
        this.popit.close_db_connections(cb);
    },
    
    "create token and retrieve": function ( test ) {    
        test.expect( 6 );
        var Token = this.Token;
        
        var token = new Token({
          action: 'log_in_user',
          args: {
            email: 'test@example.com',
            redirect_to: '/foobar',
          },
        });

        // check that the dates are set
        test.ok( token.created, 'created');
        test.ok( token.expires, 'expires');

        // check that expires is as we expect
        var three_days = 3 * 86400 * 1000;
        test.ok(
             token.expires >= Date.now() + three_days - 1000
          && token.expires <= Date.now() + three_days + 1000,
          "expires is in expected range"
        );
        
        token.save(function(err) {
          test.ifError(err);

          // check that we can retrieve it
          Token.findValid(token.id, function(err,doc) {
            test.ifError(err);
            test.equal( doc.id, token.id, "retrieved token" );
            test.done();
          });
          
        });
        
    },

    "create expiredtoken and retrieve": function ( test ) {    
        test.expect( 7 );
        var Token = this.Token;
        
        var token = new Token({
          expires: Date.now(),
          action: 'log_in_user',
        });

        token.save(function(err) {
          test.ifError(err);

          // check that we can retrieve it
          Token.findById(token.id, function(err,doc) {
            test.ifError(err);
            test.equal(doc.id, token.id, "token in db");            

            Token.findValid(token.id, function(err,doc) {
              test.ifError(err);
              test.equal(doc, null, "No token returned");
            
              // test that the token is now deleted
              Token.findById(token.id, function(err,doc) {
                test.ifError(err);
                test.equal(doc, null, "No token in db with that id");
                test.done();              
              });
            
            });
          });
        });
        
    },
    
};