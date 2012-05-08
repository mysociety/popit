// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils               = require('../../lib/utils'),
    rest                = require('../../lib/testing/rest'),
    test_server_helpers = require('../../lib/testing/server'),
    config              = require('config'),
    async               = require('async');



module.exports = {

    setUp: function (setUp_done) {
        
      utils.delete_all_testing_databases( function () {
        utils.load_test_fixtures( function () {
            test_server_helpers.start_instance_server( function () {                
                setUp_done();
            });            
        });
      });
      
      this.rest = new rest('foobar','v1');
    },

    tearDown: function (tearDown_done) {
      test_server_helpers.stop_servers(tearDown_done);
    },
    
    "access API": function (test) {

      test.expect(3);
      
      this.rest.get('').on('complete', function(data, response) {
    
        // check for 200 and json
        test.equal(response.statusCode, 200, "got 200 response");
        test.equal(response.headers['content-type'], 'application/json; charset=utf-8', "got JSON");
    
        // check that data looks right
        test.deepEqual(data, [], "data is empty array");
    
        test.done();
      });
    },
};

