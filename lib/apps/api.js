var express       = require('express'),
    schemas       = require('../schemas');

var app = module.exports = express.createServer();

app.mounted( function (parent) {

  app.use(
    '/person',
    create_api_endpoint({
      resource_name: 'person',
      schema_name:   'Person',
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
        .run(function (err, docs) {
          if (err) throw err;
          res.json({ results : docs });
        });
    });

  });

  return api_endpoint;
}



