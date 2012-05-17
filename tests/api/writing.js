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
    
    "check that un-authed user not allowed": function (test) {
      var rest = this.rest;

      test.expect(4);
      
      rest
        .post('person', { password: 'wrong' })
        .on('complete', function(data, response) {
    
          // check for 200 and json
          test.equal(response.statusCode, 401, "got 401");
          test.equal(
            response.headers['www-authenticate'],
            'Basic realm="API"',
            "got authentication header"
          );

          test.equal(
            response.headers['content-type'],
            'application/json; charset=utf-8',
            "got JSON"
          );
          
          test.deepEqual(
            data,
            { error: 'not authenticated' },
            "response data correct"
          );

          test.done();
        });
        
        // FIXME - also need to test that cookie based auth works. May well be easiest
        // to test using the selenium tests.
      },

    "create a new person (bad values, expect error)": function (test) {
      var rest = this.rest;

      test.expect(3);
      
      rest
        .post(
          'person',
          {
            data: {
              name: "",

              // TODO test that the errors returned for deep validation failures
              // are reasonable.
              // links: [ { bob: 'test' }],
            },
          }
        )
        .on('complete', function(data, response) {
    
          // check for 200 and json
          test.equal(response.statusCode, 400, "got 400");
          test.equal(
            response.headers['content-type'],
            'application/json; charset=utf-8',
            "got JSON"
          );
          
          test.deepEqual(
            data,
            {
              errors: {
                slug: 'required',
                name: 'required'
              }
            },
            "response data correct"
          );

          test.done();
        });
    },

    "create a new person": function (test) {
      var rest = this.rest;

      test.expect(8);
      
      rest
        .post(
          'person',
          {
            data: {
              name: "Joe Bloggs",
            },
          }
        )
        .on('complete', function(data, response) {
    
          // check for 200 and json
          test.equal(response.statusCode, 201, "got 201");
          test.equal(
            response.headers['content-type'],
            'application/json; charset=utf-8',
            "got JSON"
          );
          
          var url_regex = /^http:\/\/foobar.127-0-0-1.org.uk:3100\/api\/v1\/person\/[0-9a-f]{24}$/;
          
          test.ok(
            url_regex.test( response.headers['location'] ),
            "got newly created location"
          );
          
          test.equal( data.ok, true, "response data.ok correct");
          test.ok( data.api_url, response.headers['location'], "response data.api_url correct");
                  
          // get the new location and check that it is correct
          rest
            .get(response.headers['location'])
            .on('complete', function (data, response) {
          
              test.equal(response.statusCode, 200, "got 200");

              test.equal(data.result.name, 'Joe Bloggs', "got name");
              test.equal(data.result.slug, 'joe-bloggs', "got slug");

              test.done();
            });
        
        });
    },
    
    "create a new person (duplicate name - expect new slug)": function (test) {
      var rest = this.rest;

      test.expect(4);
      
      rest
        .post(
          'person',
          {
            data: {
              name: "George Bush", // already in db from fixture
            },
          }
        )
        .on('complete', function(data, response) {
    
            // check for 200 and json
            test.equal(response.statusCode, 201, "got 201");

            // get the new location and check that it is correct
            rest
              .get(response.headers['location'])
              .on('complete', function (data, response) {

                test.equal(response.statusCode, 200, "got 200");

                test.equal(data.result.name, 'George Bush',  "got name");
                test.equal(data.result.slug, 'george-bush-1', "got incremented slug");

                test.done();
              });

          });
    },
    
    "check that we get correct errors for not allowed methods" : function (test) {
      var rest = this.rest;

      function create_error_test ( method, url ) {
        return function (cb) {

          // console.log( method, url );

          // rest.request(url, {method: method})  <-- does not appear to handle
          // the returned JSON for us - it comes through as a string. Also needs
          // 'delete' instead of 'del'. Should dig deeper in restler to find
          // what the issue is. The direct access trick below works.

          rest[method](url)
            .on('complete', function(data, response) {
          
              // check for 405 and json
              test.equal(response.statusCode, 405, "got 405");
              test.equal(
                response.headers['content-type'],
                'application/json; charset=utf-8',
                "got JSON"
              );
          
              test.deepEqual(
                data,
                { error: "method not allowed" },
                "response data correct"
              );
          
              cb();
            });
        };
      }
      
      var tests = [
        create_error_test( 'put', 'person' ),
        create_error_test( 'del', 'person' ),
      ];

      test.expect( tests.length * 3 );
      async.series( tests, test.done );
      
    },
    

};

