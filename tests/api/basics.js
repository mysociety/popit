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
        
      this.rest = new rest('foobar','v1');

      utils.delete_all_testing_databases( function () {
        utils.load_test_fixtures( function () {
            test_server_helpers.start_server( function () {                
                setUp_done();
            });            
        });
      });
    },

    tearDown: function (tearDown_done) {
      test_server_helpers.stop_server(tearDown_done);
    },
    
    "access API docs": function (test) {

      test.expect(2);
      
      this.rest.get('/api').on('complete', function(data, response) {
    
        // check for 200 and json
        test.equal(response.statusCode, 200, "got 200 response");
        test.equal(response.headers['content-type'], 'text/html; charset=utf-8', "got HTML");
        
        test.done();
      });
    },
    
    "access API": function (test) {

      test.expect(3);
      
      this.rest.get('').on('complete', function(data, response) {
    
        // check for 200 and json
        test.equal(response.statusCode, 200, "got 200 response");
        test.equal(response.headers['content-type'], 'application/json; charset=utf-8', "got JSON");
    
        // check that data looks right
        test.deepEqual(
          data,
          {
            comment: 'This is the API entry point - use a link in \'meta\' to search a collection.',
            meta: {
              person_api_url:       'http://foobar.127-0-0-1.org.uk:3100/api/v1/person',
              organisation_api_url: 'http://foobar.127-0-0-1.org.uk:3100/api/v1/organisation',
              position_api_url:     'http://foobar.127-0-0-1.org.uk:3100/api/v1/position',
            },
          },
          "response in links to parts of the API"
        );
    
        test.done();
      });
    },
    
    "access API using JSONP": function (test) {

      test.expect(3);
      
      this.rest.get('?callback=name_of_callback').on('complete', function(data, response) {
    
        test.equal(response.statusCode, 200, "got 200 response");

        test.equal(
          response.headers['content-type'],
          'text/javascript; charset=utf-8',
          "got JavaScript"
        );

        test.ok(
          /^name_of_callback\({.+}\);$/.test(data),
          "response JSON is wrapped in a callback"
        );
    
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
    
    "list people" : function (test) {
      test.expect(3);
      
      this.rest
        .get('person')
        .on('complete', function(data, response) {
      
          test.equal(response.statusCode, 200, "got 200 response");
      
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
              meta: {
                api_url:  'http://foobar.127-0-0-1.org.uk:3100/api/v1/person/4f9ea1306e8770d854c45a1d',
                edit_url: 'http://foobar.127-0-0-1.org.uk:3100/person/george-bush',
              },
            },
            "george-bush details correct"
          );
          
          test.done();
        });
    },
    
    "limit people by name" : function (test) {
      test.expect(3);
      
      this.rest
        .get('person?name=bush')
        .on('complete', function(data, response) {
      
          test.equal(response.statusCode, 200, "got 200 response");
      
          var results = data.results;
      
          // test we got the first four presidents
          test.deepEqual(
            _.pluck(results, 'slug').sort(),
            [ 'george-bush', 'george-w-bush', ].sort(),
            "got Bush president slugs"
          );
          
          // test that the api_url is correct
          test.equal(
            _.sortBy( results, 'slug')[0].meta.api_url,
            'http://foobar.127-0-0-1.org.uk:3100/api/v1/person/4f9ea1306e8770d854c45a1d',
            "got api_url as expected"
          );
                    
          test.done();
        });
    },
    
    "load one person (by ObjectId)" : function (test) {
      test.expect(2);
      
      this.rest
        .get('person/4f9ea1306e8770d854c45a1d')
        .on('complete', function(data, response) {
      
          test.equal(response.statusCode, 200, "got 200 response");
      
          var result = data.result;
      
          // test that a person object looks correct
          test.deepEqual(
            result,
            {
              _id:     '4f9ea1306e8770d854c45a1d',
              name:    'George Bush',
              slug:    'george-bush',
              summary: '41th President of the United States',
              images:          [],
              links:           [],
              contact_details: [],
              meta: {
                edit_url: 'http://foobar.127-0-0-1.org.uk:3100/person/george-bush',
              },
            },
            "george-bush details correct"
          );
          
          test.done();
        });
    },
    
    "load one person (by slug)" : function (test) {

      // find the entry, and then redirect to the ObjectId based api url

      test.expect(2);
      
      this.rest
        .get('person/george-bush')
        .on('complete', function(data, response) {
      
          test.equal(response.statusCode, 200, "got 200 response");
      
          test.equal(
            response.client._httpMessage.path, // note - can't see how to get this through proper calls
            '/api/v1/person/4f9ea1306e8770d854c45a1d',
            "redirected to ObjectId url"
          );
          
          test.done();
        });
    },
        
    "load a not found objectid" : function (test) {
      test.expect(1);
      
      this.rest
        .get('person/4f9ea1306e8770d854c4aaaa')
        .on('complete', function(data, response) {
          test.equal(response.statusCode, 404, "got 404 response");
          test.done();
        });
    },

    "load a not found slug" : function (test) {
      test.expect(1);
      
      this.rest
        .get('person/i-dont-exist')
        .on('complete', function(data, response) {
          test.equal(response.statusCode, 404, "got 404 response");
          test.done();
        });
    },
    
    "list all positions": function (test) {
      test.expect(2);
      
      this.rest
        .get('position')
        .on('complete', function(data, response) {
          test.equal(response.statusCode, 200, "got 200 response");

          // test we got the first four presidents
          test.deepEqual(
            _.pluck(data.results, 'title').sort(),
            [ 'President', 'President', 'President', 'President' ].sort(),
            "got expected titles"
          );          

          test.done();
        });
      
    },
    
    "list one persons positions": function (test) {
      test.expect(2);
      
      this.rest
        .get('position?person=4f9ea1326e8770d854c45a1e') // Clinton
        .on('complete', function(data, response) {
          test.equal(response.statusCode, 200, "got 200 response");

          // test we got the first four presidents
          test.deepEqual(
            data.results,
            [{
              _id:          '4f9ea1326e8770d854c45a23',
              title:        'President',
              person:       '4f9ea1326e8770d854c45a1e',
              organisation: '4f9ea1326e8770d854c45a21',
              meta: {
                api_url: 'http://foobar.127-0-0-1.org.uk:3100/api/v1/position/4f9ea1326e8770d854c45a23',
              },
            }],
            "got Clinton's Presidency"
          );          

          test.done();
        });
      
    },
    
    // test pagination
    
    // test sorting
    
    
};

