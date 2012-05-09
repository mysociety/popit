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

  api_endpoint.param('document_id', function (req, res, next, document_id) {
    var model = req.popit.model( options.schema_name );
    model.findById(document_id, function(err, doc){
      if (err)  return next(err);
      if (!doc) return res.json( { error: "page not found" }, 404 );
      
      res.local('doc', doc);
      next();
    });
  });

  api_endpoint.param('embedded_name', function (req, res, next, name) {
    var doc = res.local('doc');
    
    // check that the name given is in fact one that we can use
    var model = req.popit.model( options.schema_name );
    var tree  = model.schema.tree;
    
    console.log(tree[name]);
    
    if ( tree[name] && _.isArray(tree[name]) ) {
      res.local('embedded_name', name );
      return next();
    } else {
      return next("Error: " + name + " is not an embedded name");
    }

  });


  api_endpoint.param('embedded_id', function (req, res, next, embedded_id) {
    var doc    = res.local('doc');

    var embedded_name = req.param('embedded_name');
    var embedded_id   = req.param('embedded_id');
    var embedded_doc  = doc[embedded_name].id(embedded_id);
    
    if (embedded_doc) {
      res.local('embedded_doc', embedded_doc);
      next();
    } else {
      res.json({ error: "page not found"}, 404);      
    }
    
  });


  api_endpoint.mounted(function (parent_app) {

    api_endpoint.get( '/', function (req,res,next) {
      req.popit
        .model(options.schema_name)
        .find()
        .select( options.collection_fields )
        .run(function (err, docs) {
          if (err) throw err;

          var results = _.map( docs, function (doc) {
            var result = doc.toObject();
            result.meta = {
              api_url: current_absolute_url(req) + doc._id,
              edit_url: base_url(req) + doc.slug_url,
            };
            return result;
          });

          res.json({
            results: results,
            // meta: {},
          });

        });
    });


    api_endpoint.get('/:document_id', function (req,res) {

      var doc    = res.local('doc');
      var result = doc.toObject();
      
      // dig down in the result and add meta as needed
      _.keys(result).forEach( function (key) {
        if (_.isArray(result[key])) {
          result[key].forEach( function (item) {
            if (_.isObject(item)) {
              item.meta = {
                api_url: current_absolute_url(req) + '/' + key + '/' + item._id,
              };              
            }
          });
        }
      });

      result.meta = {
        api_url: current_absolute_url(req),
        edit_url: base_url(req) + doc.slug_url,
      };
      
      res.json( { result: result } );
    });


    api_endpoint.get('/:document_id/:embedded_name', function (req,res) {

      var doc           = res.local('doc');
      var embedded_name = res.local('embedded_name');

      var results = _.map( doc[embedded_name], function (doc) {
        var result = doc.toObject();
        result.meta = {
          api_url: current_absolute_url(req) + '/' + doc._id,
        };
        return result;
      });

      res.json( { results: results } );
    });

    api_endpoint.get('/:document_id/:embedded_name/:embedded_id', function (req,res) {

      var embedded_doc = res.local('embedded_doc');
      var result = embedded_doc.toObject();

      res.json( { result: result } );
    });

  });

  return api_endpoint;
}



