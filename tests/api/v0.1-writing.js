"use strict"; 

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
        
      this.rest = new rest('test','v0.1');

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
              .get(response.headers.location)
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
        create_error_test( 'put',  'person' ),
        create_error_test( 'del',  'person' ),
        create_error_test( 'post', 'person/4f9ea1316e8770d854c45a1e' ),
      ];

      test.expect( tests.length * 3 );
      async.series( tests, test.done );
    },
    
    "check deleting top level document": function (test) {
      var rest = this.rest;
      var url = 'person/4f9ea1316e8770d854c45a1e';

      test.expect(5);
      
      async.series(
        [
          // check that the document exists
          function(cb) {
            rest.get(url).on('complete', function(data, response) {
              test.equal(response.statusCode, 200, "got 200 - document exists");              
              cb();
            });
          },
          // delete the document
          function(cb) {
            rest.del(url).on('complete', function(data, response) {
              test.equal(response.statusCode, 200, "got 200 - document deleted");
              test.deepEqual( data, {}, "empty JSON hash returned" );      
              cb();
            });
          },
          // check that the document is now gone
          function(cb) {
            rest.get(url).on('complete', function(data,response) {
              test.equal(response.statusCode, 404, "got 404 - document gone");              
              cb();
            });
          },
          // delete the document again, should 404 as not found
          function(cb) {
            rest.del(url).on('complete', function(data, response) {
              test.equal(response.statusCode, 404, "got 404 - not found for subsequent delete");
              cb();
            });
          },
        ],
        test.done
      );
    },

    "update a document": function (test) {
      var rest         = this.rest;
      var document_url = null;
      var document_id  = null;
      
      // use this to pass the document data from one stage to the next.
      var document_data = null;

      test.expect(11);
      
      async.series(
        [
          // create a new person
          function(cb) {
            rest
              .post(
                'person',
                {
                  headers: {'Content-Type': 'application/json'},
                  data:    JSON.stringify({ name: "Joe Bloggs", summary: "Just another Joe" }),
                }
              )
              .on('complete', function (data, response) {
                test.equal(response.statusCode, 201, "got 201");
                document_url = response.headers.location;
                document_id = _.last(document_url.split('/'));
                cb();
              });
          },
          // check that person created as expected
          function (cb) {
            rest
              .get(document_url)
              .on('complete', function(data, response) {

                test.deepEqual(
                  data.result,
                  {
                    id:             document_id,
                    name:            "Joe Bloggs",
                    slug:            "joe-bloggs",
                    summary:         "Just another Joe",
                    personal_details: {
                      date_of_birth: { formatted: '', end: null, start: null },
                      date_of_death: { formatted: '', end: null, start: null },
                    },
                    other_names:     [],
                    images:          [],
                    links:           [],
                    contact_details: [],
                    meta: {
                      api_url: 'http://test.127.0.0.1.xip.io:3100/api/v0.1/person/' + document_id,                      
                      edit_url: 'http://test.127.0.0.1.xip.io:3100/person/joe-bloggs',
                      positions_api_url: 'http://test.127.0.0.1.xip.io:3100/api/v0.1/position?person=' + document_id,
                    },
                  },
                  "Person created as expected"
                );

                document_data = data.result;

                cb();
              });
          },
          // update one field
          function (cb) {

            var put_data = _.extend(
              {}, 
              document_data,
              { name: 'Fred Jones', notInSchemaAttribute: 1234 }
            );
                  
            rest
              .put(
                document_url,
                {
                  headers: {'Content-Type': 'application/json'},
                  data:    JSON.stringify(put_data),
                }
              )
              .on('complete', function(data, response) {
                test.equal(response.statusCode, 200, "got 200");
                test.deepEqual(
                  data.result,
                  {
                    id:             document_id,
                    name:            "Fred Jones",
                    slug:            "joe-bloggs",
                    summary:         "Just another Joe",
                    personal_details: {
                      date_of_birth: { formatted: '', end: null, start: null },
                      date_of_death: { formatted: '', end: null, start: null },
                    },
                    notInSchemaAttribute: '1234',
                    other_names:     [],
                    images:          [],
                    links:           [],
                    contact_details: [],
                    meta: {
                      api_url: 'http://test.127.0.0.1.xip.io:3100/api/v0.1/person/' + document_id,                      
                      edit_url: 'http://test.127.0.0.1.xip.io:3100/person/joe-bloggs',
                      positions_api_url: 'http://test.127.0.0.1.xip.io:3100/api/v0.1/position?person=' + document_id,
                    },
                  },
                  "Person updated as expected"
                );

                document_data = data.result;

                cb();
              });
          },
          // remove custom field
          function (cb) {
          
            var put_data = document_data;
            delete put_data.notInSchemaAttribute;
          
            rest
              .put(
                document_url,
                {
                  headers: {'Content-Type': 'application/json'},
                  data:    JSON.stringify(put_data),
                }
              )
              .on('complete', function(data, response) {
                test.equal(response.statusCode, 200, "got 200");
                test.deepEqual(
                  data.result,
                  {
                    id:             document_id,
                    name:            "Fred Jones",
                    slug:            "joe-bloggs",
                    summary:         "Just another Joe",
                    personal_details: {
                      date_of_birth: { formatted: '', end: null, start: null },
                      date_of_death: { formatted: '', end: null, start: null },
                    },
                    other_names:     [],
                    images:          [],
                    links:           [],
                    contact_details: [],
                    meta: {
                      api_url: 'http://test.127.0.0.1.xip.io:3100/api/v0.1/person/' + document_id,                      
                      edit_url: 'http://test.127.0.0.1.xip.io:3100/person/joe-bloggs',
                      positions_api_url: 'http://test.127.0.0.1.xip.io:3100/api/v0.1/position?person=' + document_id,
                    },
                  },
                  "notInSchemaAttribute removed as expected"
                );
          
                document_data = data.result;
          
                cb();
              });
          },
          // add contact details
          function (cb) {
          
            var put_data = document_data;

            put_data.contact_details[0] = {
              kind: 'Twitter',
              value: '@foobar',
            };
          
            rest
              .put(
                document_url,
                {
                  headers: {'Content-Type': 'application/json'},
                  data:    JSON.stringify(put_data),
                }
              )
              .on('complete', function(data, response) {
                test.equal(response.statusCode, 200, "got 200");

                // Assume that the contact detail entry has been created. Grab
                // the ID so that we can fill in the blanks for it var
                var contact_detail_id = data.result.contact_details[0]._id;

                test.deepEqual(
                  data.result,
                  {
                    id:             document_id,
                    name:            "Fred Jones",
                    slug:            "joe-bloggs",
                    summary:         "Just another Joe",
                    personal_details: {
                      date_of_birth: { formatted: '', end: null, start: null },
                      date_of_death: { formatted: '', end: null, start: null },
                    },
                    other_names:     [],
                    images:          [],
                    links:           [],
                    contact_details: [
                      {
                        _id: contact_detail_id,
                        kind: 'Twitter',
                        value: '@foobar',
                      }
                    ],
                    meta: {
                      api_url: 'http://test.127.0.0.1.xip.io:3100/api/v0.1/person/' + document_id,                      
                      edit_url: 'http://test.127.0.0.1.xip.io:3100/person/joe-bloggs',
                      positions_api_url: 'http://test.127.0.0.1.xip.io:3100/api/v0.1/position?person=' + document_id,
                    },
                  },
                  "contact detail added to record"
                );
          
                document_data = data.result;
          
                cb();
              });
          },
          // Try changing things that should not be changed.
          function (cb) {
          
            var put_data = _.clone(document_data);

            put_data.id = 'foo';
            put_data.meta = { this_should_not_be_here: 'nope' };
          
            rest
              .put(
                document_url,
                {
                  headers: {'Content-Type': 'application/json'},
                  data:    JSON.stringify(put_data),
                }
              )
              .on('complete', function(data, response) {
                test.equal(response.statusCode, 200, "got 200");

                var contact_detail_id  = put_data.contact_details[0]._id;

                test.deepEqual(
                  data.result,
                  {
                    id:              document_id,
                    name:            "Fred Jones",
                    slug:            "joe-bloggs",
                    summary:         "Just another Joe",
                    personal_details: {
                      date_of_birth: { formatted: '', end: null, start: null },
                      date_of_death: { formatted: '', end: null, start: null },
                    },
                    other_names:     [],
                    images:          [],
                    links:           [],
                    contact_details: [
                      {
                        _id: contact_detail_id,
                        kind: 'Twitter',
                        value: '@foobar',
                      }
                    ],
                    meta: {
                      api_url: 'http://test.127.0.0.1.xip.io:3100/api/v0.1/person/' + document_id,                      
                      edit_url: 'http://test.127.0.0.1.xip.io:3100/person/joe-bloggs',
                      positions_api_url: 'http://test.127.0.0.1.xip.io:3100/api/v0.1/position?person=' + document_id,
                    },
                  },
                  "id and meta not changed"
                );
          
                document_data = data.result;
          
                cb();
              });
          },
        ],
        function(err) {
          test.ifError(err, 'No errors caught');
          test.done();
        }
      );
    },
    
};

