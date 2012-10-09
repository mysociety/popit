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
        
      this.rest = new rest('test','v1');

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
        create_error_test( 'del',  'person/4f9ea1316e8770d854c45a1e/links' ),
        create_error_test( 'put',  'person/4f9ea1316e8770d854c45a1e/links' ),
        create_error_test( 'post', 'person/4f9ea1316e8770d854c45a1e/links/4f9ea1326e8770d854c45a26' ),
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

    "check deleting embedded document": function (test) {
      var rest = this.rest;
      var embedded_url = 'person/4f9ea1316e8770d854c45a1e/links/4f9ea1326e8770d854c45a26';
      var document_url = 'person/4f9ea1316e8770d854c45a1e';

      test.expect(7);
      
      async.series(
        [
          // check that the document exists
          function(cb) {
            rest.get(document_url).on('complete', function(data, response) {
              test.equal(response.statusCode, 200, "got 200 - parent document exists");              
              cb();
            });
          },
          // check that the embedded document exists
          function(cb) {
            rest.get(embedded_url).on('complete', function(data, response) {
              test.equal(response.statusCode, 200, "got 200 - embedded document exists");              
              cb();
            });
          },
          // delete the document
          function(cb) {
            rest.del(embedded_url).on('complete', function(data, response) {
              test.equal(response.statusCode, 204, "got 204 - embedded document deleted");
              test.equal( data.length, 0, "no content returned" );      
              cb();
            });
          },
          // check that the document is now gone
          function(cb) {
            rest.get(embedded_url).on('complete', function(data,response) {
              test.equal(response.statusCode, 404, "got 404 - embedded document gone");              
              cb();
            });
          },
          // delete the document again, should 404 as not found
          function(cb) {
            rest.del(embedded_url).on('complete', function(data, response) {
              test.equal(response.statusCode, 404, "got 404 - not found for subsequent delete");
              cb();
            });
          },
          // check that the document has not been deleted
          function(cb) {
            rest.get(document_url).on('complete', function(data, response) {
              test.equal(response.statusCode, 200, "got 200 - parent document exists");              
              cb();
            });
          },
        ],
        test.done
      );
    },


    "create embedded document": function (test) {
      var rest = this.rest;
      var document_url       = 'person/4f9ea1316e8770d854c45a1e';
      var sub_collection_url = 'person/4f9ea1316e8770d854c45a1e/links';
      var embedded_url       = 'person/4f9ea1316e8770d854c45a1e/links/4f9ea1326e8770d854c45a26';

      // fill these in in the tests
      var original_sub_collection_ids = [];
      var sub_document_url = null;

      test.expect(10);
      
      async.series(
        [
          // check that subcollection has some items in it, store the ids
          function(cb) {
            rest.get(sub_collection_url).on('complete', function(data, response) {
              test.equal(response.statusCode, 200, "got 200 - sub_collection exists");              
              
              original_sub_collection_ids = _.pluck( data.results, '_id' );
              test.ok( original_sub_collection_ids.length >= 1, "Got some existing content" );

              cb();
            });
          },
          // add a document to the collection
          function (cb) {
            rest
              .post(sub_collection_url, { data: { url: 'http://test.com', comment: "sample url"}})
              .on('complete', function (data, response) {
                test.equal(response.statusCode, 200, "got 200 - embedded document created");              

                // get the location of the new document
                sub_document_url = response.headers.location;
                test.ok(
                  (new RegExp(sub_collection_url + '/[0-9a-f]{24}')).test(sub_document_url),
                  "New entity in subcollection"
                );

                test.equal(data.ok, true, "got 'ok' in JSON" );
                test.equal(data.api_url, sub_document_url, "got correct sub-document url" );
                test.equal(data.result.url, 'http://test.com', "got object back too");

                cb();
              });
          },
          // check that the sub_document_url works
          function (cb) {
            rest.get(sub_document_url).on('complete', function(data, response) {
              test.equal(data.result.url, 'http://test.com', "new link url correct");
              cb();
            });
          },
          // check that subcollection has more items in now
          function(cb) {
            rest.get(sub_collection_url).on('complete', function(data, response) {
              test.equal(response.statusCode, 200, "got 200 - sub_collection exists");              
              
              var post_create_sub_collection_ids = _.pluck( data.results, '_id' );

              test.ok(
                original_sub_collection_ids.length == post_create_sub_collection_ids.length - 1,
                "Got one more entry in collection"
              );

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

      test.expect(5);
      
      async.series(
        [
          // create a new person
          function(cb) {
            rest
              .post( 'person', { data: { name: "Joe Bloggs", summary: "Just another Joe" } })
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
                    _id:             document_id,
                    __v:             0,
                    name:            "Joe Bloggs",
                    slug:            "joe-bloggs",
                    summary:         "Just another Joe",
                    other_names:     [],
                    images:          [],
                    links:           [],
                    contact_details: [],
                    name_words:      [ 'joe', 'bloggs' ],
                    name_dm:         [ 'J', 'A', 'PLKS', 'PLKS', 'joe', 'bloggs' ],                    
                    meta: { edit_url: 'http://test.127.0.0.1.xip.io:3100/person/joe-bloggs' },
                  },
                  "Person created as expected"
                );
                cb();
              });
          },
          // update one field
          function (cb) {

            // TODO: should test updating using the dot notation too

            rest
              .put(document_url, { data: { name: 'Fred Jones', notInSchemaAttribute: 1234 } })
              .on('complete', function(data, response) {
                test.equal(response.statusCode, 204, "got 204");
                cb();
              });
          },
          // check it is changed (and other not)
          function (cb) {
            rest
              .get(document_url)
              .on('complete', function(data, response) {
                test.deepEqual(
                  data.result,
                  {
                    _id:             document_id,
                    __v:             0,
                    name:            "Fred Jones",
                    slug:            "joe-bloggs",
                    summary:         "Just another Joe",
                    notInSchemaAttribute: 1234,
                    other_names:     [],
                    images:          [],
                    links:           [],
                    contact_details: [],
                    name_words:      [ 'joe', 'bloggs' ],
                    name_dm:         [ 'J', 'A', 'PLKS', 'PLKS', 'joe', 'bloggs' ],                    
                    meta: { edit_url: 'http://test.127.0.0.1.xip.io:3100/person/joe-bloggs' },
                  },
                  "Person updated as expected"
                );
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

    "update a sub document": function (test) {
      var rest         = this.rest;
      var embedded_url       = 'person/4f9ea1316e8770d854c45a1e/links/4f9ea1326e8770d854c45a26';

      test.expect(3);
      
      async.series(
        [
          // update one field
          function (cb) {

            // TODO: should test updating using the dot notation too

            rest
              .put(embedded_url, { data: { url: 'http://update.test/' } })
              .on('complete', function(data, response) {
                test.equal(response.statusCode, 200, "got 200");
                cb();
              });
          },
          // check it is changed (and other not)
          function (cb) {
            rest
              .get(embedded_url)
              .on('complete', function(data, response) {
                test.deepEqual(
                  data.result,
                  {
                    _id:     '4f9ea1326e8770d854c45a26',
                    url:     'http://update.test/',
                    comment: 'William J. Clinton Foundation',
                  },
                  "Embedded document updated as expected"
                );
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

