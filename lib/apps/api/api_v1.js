/***

TODO list - these are the interactions that need to be handled, and their
current implementation state:

/api

  GET: intro page to the API (todo)

/api/v1

  GET: intro page to specific API version - probably some documentation and examples to try (todo)

/api/v1/model

  GET: list of results (done)
  GET (with parameters): filtered list (todo)
  
  POST: create a new object (todo)

  DELETE, PUT: could be used to delete/replace the whole collection - will not
  implement as really it makes no sense at this level. If you really want to do
  that you should loop over the API.

/api/v1/model/id

  GET: retrieve one single object (done)

  POST, PUT: partial update of the object, fields not given will be unchanged.
  This is so that we don't modify data that we don't know about (ie added by
  user and outside of the schema). (todo)
  
  DELETE: delete the document (todo)

/api/v1/model/id/sub_collection

  GET: list the collection (done)

  POST: append a new entry to the collection (todo)

  DELETE, PUT: will not implement - but could be used to delete/replace entire
  embedded collection

/api/v1/model/id/sub_collection/id

  GET: retrieve document from embedded collection (done)
  
  POST, PUT: partial update of embedded document (todo)
  
  DELETE: delete embedded document (todo)


***/

/* 
  FIXME: the url handling is not working elegantly. It is not possible to get
  the correct url as we are an app in an app. Hardcoded atm, but needs
  adrdessing. Might go away when Express 3.0 comes out.
*/

var express               = require('express'),
    _                     = require('underscore'),
    regexp_quote          = require('regexp-quote'),
    schemas               = require('../../schemas'),
    utils                 = require('../../utils'),
    base_url              = require('../../middleware/route').base_url,
    current_absolute_url  = require('../../middleware/route').current_absolute_url;

var app = module.exports = express.createServer();

app.mounted( function (parent) {

  app.use(
    '/person',
    create_api_endpoint({
      schema_name:       'Person',
      collection_fields: [ '_id', 'slug', 'name', 'summary' ],
    })
  );

  app.use(
    '/organisation',
    create_api_endpoint({
      schema_name:       'Organisation',
      collection_fields: [ '_id', 'slug', 'name' ],
    })
  );

  app.use(
    '/position',
    create_api_endpoint({
      schema_name:       'Position',
      collection_fields: [ '_id', 'title', 'person', 'organisation' ],
    })
  );

  app.get('/', function (req, res, next) {
    res.json([]);
  });     

  // app.all('*', function(req, res, next) {
  //   // 404
  //   res.json({ error: "page not found"}, 404);
  // });

});



function create_api_endpoint ( options ) {
  
  var api_endpoint = express.createServer();

  api_endpoint.param('document_id', function (req, res, next, document_id) {

    var model = req.popit.model( options.schema_name );

    // if the id is not an ObjectId it might be a slug - search for that and
    // redirect if so.
    var query
      = utils.is_ObjectId(document_id)
      ? model.findById(document_id)
      : model.findOne({slug: document_id});
    
    
    query.run( function (err, doc) {
      if (err)  return next(err);
      if (!doc) return res.json( { error: "page not found" }, 404 );

      // if the document_id is not the id redirect to it
      if ( document_id != doc.id ) {
        res.redirect(base_url(req) + '/api' + req.app.set('basepath') + '/' + doc.id );
      } else {
        res.local('doc', doc);
        return next();
      }
    });
  });

  api_endpoint.param('sub_name', function (req, res, next, name) {
    var doc = res.local('doc');
    
    // check that the name given is in fact one that we can use
    var model = req.popit.model( options.schema_name );
    var tree  = model.schema.tree;
    
    console.log(tree[name]);
    
    if ( tree[name] && _.isArray(tree[name]) ) {
      res.local('sub_name', name );
      return next();
    } else {
      return next("Error: " + name + " is not an embedded name");
    }

  });


  api_endpoint.param('sub_id', function (req, res, next, sub_id) {
    var doc    = res.local('doc');

    var sub_name = req.param('sub_name');
    var sub_id   = req.param('sub_id');
    var sub_doc  = doc[sub_name].id(sub_id);
    
    if (sub_doc) {
      res.local('sub_doc', sub_doc);
      next();
    } else {
      res.json({ error: "page not found"}, 404);      
    }
    
  });


  api_endpoint.mounted(function (parent_app) {


    this.get( '/',                               read_collection );
    this.get( '/:document_id',                   read_document );
    this.get( '/:document_id/:sub_name',         read_sub_collection );
    this.get( '/:document_id/:sub_name/:sub_id', read_sub_document );


    function read_collection (req,res,next) {

      var model  = req.popit.model(options.schema_name);
      var schema = model.schema;
      var where  = {};
      
      var api_base_url  = base_url(req) + '/api' + req.app.set('basepath') + '/';
      var edit_base_url = base_url(req);

      // for each query parameter that we know about create a regex search.
      _.each( req.query, function(value, key) {
        if ( schema.path(key) ) {
          
          var key_type = schema.path(key).options.type;

          if( key_type == String ) {
            // TODO - default should not be regex but exact
            where[key] = RegExp( regexp_quote(value), 'i' );
          } else {
            where[key] = value;            
          }
        }
      });

      model
        .find(where)
        .select( options.collection_fields )
        .run(function (err, docs) {
          if (err) throw err;

          var results = _.map( docs, function (doc) {
            var result = doc.toObject();
            result.meta = {
              api_url:  api_base_url  + doc._id,
            };
            
            if (doc.slug_url)
              result.meta.edit_url = edit_base_url + doc.slug_url;
            
            return result;
          });

          res.json({
            results: results,
            // meta: {},
          });

        });
    }


    function read_document (req,res) {

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

      if (doc.slug_url) {
        result.meta = {
          edit_url: base_url(req) + doc.slug_url,
        };
      }
      
      res.json( { result: result } );
    }


    function read_sub_collection (req,res) {

      var doc           = res.local('doc');
      var sub_name = res.local('sub_name');

      var results = _.map( doc[sub_name], function (doc) {
        var result = doc.toObject();
        result.meta = {
          api_url: current_absolute_url(req) + '/' + doc._id,
        };
        return result;
      });

      res.json( { results: results } );
    }


    function read_sub_document (req,res) {

      var sub_doc = res.local('sub_doc');
      var result = sub_doc.toObject();

      res.json( { result: result } );
    }

  });

  return api_endpoint;
}



