var express               = require('express'),
    _                     = require('underscore'),
    schemas               = require('../schemas'),
    base_url              = require('../middleware/route').base_url,
    current_absolute_url  = require('../middleware/route').current_absolute_url;

var app = module.exports = express.createServer();

app.mounted( function (parent) {

  app.use(
    '/person',
    create_api_endpoint({
      resource_name:     'person',
      schema_name:       'Person',
      collection_fields: [ '_id', 'slug', 'name', 'summary' ],
    })
  );

  app.get('/', function (req, res, next) {
    res.json([]);
  });     

  app.all('*', function(req, res, next) {
    // 404
    res.json({ error: "page not found"}, 404);
  });

});



function create_api_endpoint ( options ) {
  
  var api_endpoint = express.createServer();

  api_endpoint.mounted(function (parent_app) {

    api_endpoint.get( '/', function (req,res,next) {
      req.popit
        .model(options.schema_name)
        .find()
        .select( options.collection_fields )
        .run(function (err, docs) {
          if (err) throw err;

          var results = _.map( docs, function (doc) {
            var object = doc.toObject();
            object.meta = {
              api_url: current_absolute_url(req) + object._id,
              edit_url: base_url(req) + doc.slug_url,
            };
            return object;
          });

          res.json({
            results: results,
            // meta: {},
          });

        });
    });

  });

  return api_endpoint;
}



