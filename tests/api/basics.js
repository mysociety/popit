// switch to testing mode
process.env.NODE_ENV = 'testing';

var utils               = require('../../lib/utils'),
    rest                = require('../../lib/testing/rest'),
    test_server_helpers = require('../../lib/testing/server'),
    config              = require('config'),
    async               = require('async'),
    _                   = require('underscore');



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
    
    "access API bit that does not exist": function (test) {

      test.expect(3);
      
      this.rest.get('this/does/not/exist').on('complete', function(data, response) {
    
        // check for 200 and json
        test.equal(response.statusCode, 404, "got 404 response");
        test.equal(response.headers['content-type'], 'application/json; charset=utf-8', "got JSON");
    
        // check that data looks right
        test.deepEqual(data, {error: 'page not found'}, "data is error message");
    
        test.done();
      });
    },
    
    "search for person" : function (test) {
        test.expect(2);

        this.rest
          .get('person')
          .on('success', function(data, response) {

            var results = data.results;

            // test we got the first four presidents
            test.deepEqual(
              _.pluck(results, 'slug').sort(),
              [ 'george-bush', 'bill-clinton', 'george-w-bush', 'barack-obama' ].sort(),
              "got president slugs"
            );
            
            // test that a person object looks correct
            test.deepEqual(
              results.sort()[0],
              { 
                _id:     '4f9ea1306e8770d854c45a1d',
                 slug:   'george-bush',
                name:    'George Bush',
                summary: '41th President of the United States',
              },
              "george-bush details correct"
            );
            
            test.done();
          })
          .on('fail', function (err, response) {
            test.ok(null, 'bad response');
            test.done();
          });
    },
    
    // test pagination
    
    // test sorting
    
    
};

