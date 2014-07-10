var assert = require('assert');
var apiApp = require('../lib/apps/api/index.js');
var supertest = require('supertest');

describe("API v0.1", function() {
  var request = supertest(apiApp);
  it("returns metadata", function(done) {
    request.get('/v0.1')
    .set('Host', 'test.popit.example.org')
    .expect(200)
    .expect({
      note: "This is the API entry point - use a '*_api_url' link in 'meta' to search a collection.",
      meta: {
        persons_api_url: "http://test.popit.example.org/api/v0.1/persons",
        organizations_api_url: "http://test.popit.example.org/api/v0.1/organizations",
        memberships_api_url: "http://test.popit.example.org/api/v0.1/memberships",
        posts_api_url: "http://test.popit.example.org/api/v0.1/posts",
        image_proxy_url: "http://test.popit.example.org/image-proxy/"
      }
    }, done)
  });
});
