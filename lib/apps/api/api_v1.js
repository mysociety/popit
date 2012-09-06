/***

TODO list - these are the interactions that need to be handled, and their
current implementation state:

/api

  GET: intro page to the API (todo)

/api/v1

  GET: intro JSON to specific API version - probably some useful links (partly done)

/api/v1/model

  GET: list of results (done)
  GET (with parameters): filtered list (partly done)
  
  POST: create a new object (done)

  DELETE, PUT: could be used to delete/replace the whole collection - will not
  implement as really it makes no sense at this level. If you really want to do
  that you should loop over the API. Returns an error 405. (done)

/api/v1/model/id

  GET: retrieve one single object (done)

  POST: Errors - for us "Treat the addressed member as a collection in its own
  right and create a new entry in it." does not make sense. (done)
  
  PUT: partial update of the object, fields not given will be unchanged. This
  is so that we don't modify data that we don't know about (ie added by user and
  outside of the schema). (done)
  
   DELETE: delete the document (done)

/api/v1/model/id/sub_collection

  GET: list the collection (done)

  POST: append a new entry to the collection (done)

  DELETE, PUT: will not implement - but could be used to delete/replace entire
  embedded collection. Should error 405 (done)

/api/v1/model/id/sub_collection/id

  GET: retrieve document from embedded collection (done)
  
  POST: errors - see entry for '/api/v1/model/id' (done)
  
  PUT: partial update of embedded document (done)
  
  DELETE: delete embedded document (done)


***/

/* 
  TODO: the url handling is not working elegantly. It is not possible to get
  the correct url as we are an app in an app. Hardcoded atm, but needs
  adrdessing. Might go away when Express 3.0 comes out.
*/

var express               = require('express'),
    _                     = require('underscore'),
    regexp_quote          = require('regexp-quote'),
    schemas               = require('../../schemas'),
    utils                 = require('../../utils'),
    base_url              = require('../../middleware/route').base_url,
    current_absolute_url  = require('../../middleware/route').current_absolute_url,
    apiRequireUser        = require('../../middleware/route').apiRequireUser,
    about                 = require('../about');

var app = module.exports = express.createServer();

// Ensure that these methods all require a user.
app.post( '*', apiRequireUser );
app.put(  '*', apiRequireUser );
app.del(  '*', apiRequireUser );

// Allow for JSONP
app.set("jsonp callback", true);

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

    var api_base_url = base_url(req) + '/api/v1/';

    res.json({
      comment: "This is the API entry point - use a link in 'meta' to search a collection.",
      meta: {
        person_api_url: api_base_url + 'person',
        organisation_api_url: api_base_url + 'organisation',
        position_api_url: api_base_url + 'position',
      },
    });
  });     

  app.get('/about', function (req, res, next) {

    var about_object = about();
    var about_info = about_object.load_about_data(req, function(result){
      res.json({
        'result' : result,
      });
    });
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
    
    
    query.exec( function (err, doc) {
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

    this.get(  '/', read_collection    );
    this.post( '/', create             );
    this.put(  '/', method_not_allowed );
    this.del(  '/', method_not_allowed );

    this.get(  '/:document_id', read_document );
    this.post( '/:document_id', method_not_allowed );
    this.put(  '/:document_id', update_document );
    this.del(  '/:document_id', delete_document );

    this.get(  '/:document_id/:sub_name', read_sub_collection );
    this.post( '/:document_id/:sub_name', create_in_subcollection );
    this.put(  '/:document_id/:sub_name', method_not_allowed );
    this.del(  '/:document_id/:sub_name', method_not_allowed );

    this.get(  '/:document_id/:sub_name/:sub_id', read_sub_document );
    this.post( '/:document_id/:sub_name/:sub_id', method_not_allowed );
    this.put(  '/:document_id/:sub_name/:sub_id', update_sub_document );
    this.del(  '/:document_id/:sub_name/:sub_id', delete_sub_document );
    

    function method_not_allowed (req,res) {
      res.json({error: "method not allowed"}, 405);
    }


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
        .exec(function (err, docs) {
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
    
    function create (req,res) {

      var Model  = req.popit.model(options.schema_name);
      var doc = new Model( req.body );
      doc.save(function(err) {
        if (err) {

          // extract the basic error details
          var errors = {};
          _.keys(err.errors).forEach(function(key) {
            errors[key] = err.errors[key].type;
          });


          res.json({errors: errors}, 400);
        } else {
          res.header(
            'location',
            base_url(req) + '/api' + req.app.set('basepath') + '/' + doc.id
          );

          res.local('doc', doc);
          res.statusCode = 201;

          // If this is a document being created via the frontend js add a flash message
          // that will be seen after the redirect. This might be quite brittle and may
          // need to be replaced with something more resilient.
          if ( req.xhr ) {
            req.flash("info", "New entry '%s' created.", doc.name );
          }

          // do a normal GET
          return read_document(req,res);
        }
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
                api_url: base_url(req) + '/api' + req.app.set('basepath') + '/' + doc.id + '/' + key + '/' + item._id,
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
    
    function update_document (req,res, next) {
      var doc = res.local('doc');
      var model = req.popit.model( options.schema_name );
      
      model.update(
        { _id: doc.id },
        { $set: req.body },
        {},
        function (err, numAffected) {
          if (err) return next(err);
          res.send('', 204);
        }
      );      
    }


    function delete_document (req,res) {
      var doc    = res.local('doc');
      doc.remove( function(err) {
        if (err) throw err;

        // create a flash message for people using the frontend
        if ( req.xhr ) {
          req.flash("info", "Entry '%s' deleted.", doc.name );
        }        

        // I'd like to send a 204, but backbone wants an empty JSON hash
        // which jQuery does not seem to pass along unless you use the 200
        // status code - see http://stackoverflow.com/a/7310375/5349
        // res.send('', 204); // <-- does not work :(
        res.json({}, 200);
      
      });
    }


    function read_sub_collection (req,res) {

      var doc      = res.local('doc');
      var sub_name = res.local('sub_name');

      var results = _.map( doc[sub_name], function (sub_doc) {
        var result = sub_doc.toObject();
        result.meta = {
          api_url: base_url(req) + '/api' + req.app.set('basepath') + '/' + doc.id + '/' + sub_name + '/' + sub_doc.id,
        };
        return result;
      });

      res.json( { results: results } );
    }

    function create_in_subcollection (req,res) {
      var doc      = res.local('doc');
      var sub_name = res.local('sub_name');

      var doc_to_add = req.body;
      doc[sub_name].push( doc_to_add );
      
      doc.save(function(err) {
        if (err) {
          var errors = {};
          _.keys(err.errors).forEach(function(key) {
            errors[key] = err.errors[key].type;
          });
      
          res.json({errors: errors}, 400);
        } else {

          var created_doc_id = _.last(doc[sub_name]).id;

          res.header(
            'location',
            base_url(req) + '/api' + req.app.set('basepath') + '/' + doc.id + '/' + sub_name + '/' + created_doc_id
          );
          res.json({
            ok: true,
            api_url: res.header('location'),
            result: _.last(doc[sub_name]).toObject()
          });
        }
      });
    }


    function read_sub_document (req,res) {

      var sub_doc = res.local('sub_doc');
      var result = sub_doc.toObject();

      res.json( { result: result } );
    }


    function update_sub_document (req,res, next) {
      var doc     = res.local('doc');
      var sub_doc = res.local('sub_doc');

      _.each( req.body, function (value, key) {
        if ( sub_doc.schema.path(key) )
          sub_doc.set(key, value);
      });

      doc.save(function (err) {
        if (err) return next(err);
        res.json({ result: sub_doc.toObject() });
      });      
    }


    function delete_sub_document (req,res) {
      var sub_doc = res.local('sub_doc');
      var doc     = res.local('doc');
      sub_doc.remove();
      doc.save( function(err) {
        if (err) throw err;
        res.send('', 204);
      });
    }

  });
  
  return api_endpoint;
}



