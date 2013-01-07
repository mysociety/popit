"use strict"; 

/***

TODO list - these are the interactions that need to be handled, and their
current implementation state:

/api

  GET: intro page to the API (todo)

/api/v0.1

  GET: intro JSON to specific API version - probably some useful links (partly done)

/api/v0.1/model

  GET: list of results (done)
  GET (with parameters): filtered list (partly done)
  
  POST: create a new object (done)

  DELETE, PUT: could be used to delete/replace the whole collection - will not
  implement as really it makes no sense at this level. If you really want to do
  that you should loop over the API. Returns an error 405. (done)

/api/v0.1/model/id

  GET: retrieve one single object (done)

  POST: Errors - for us "Treat the addressed member as a collection in its own
  right and create a new entry in it." does not make sense. (done)
  
  PUT: Completely replace the existing document. Will be validated.
  
  DELETE: delete the document (done)

***/

/* 
  TODO: the url handling is not working elegantly. It is not possible to get
  the correct url as we are an app in an app. Hardcoded atm, but needs
  addressing. Might go away when Express 3.0 comes out.
*/

var express               = require('../../express-inherit'),
    config                = require('config'),
    _                     = require('underscore'),
    regexp_quote          = require('regexp-quote'),
    schemas               = require('../../schemas'),
    utils                 = require('../../utils'),
    base_url              = require('../../middleware/route').base_url,
    current_absolute_url  = require('../../middleware/route').current_absolute_url,
    apiRequireUserOrGuest = require('../../apps/auth').apiRequireUserOrGuest,
    about                 = require('../about'),
    parseUrl              = require('url').parse,
    resolveUrl            = require('url').resolve;

var app = module.exports = express();

// Ensure that these methods all require a user.
app.post( '*', apiRequireUserOrGuest );
app.put(  '*', apiRequireUserOrGuest );
app.del(  '*', apiRequireUserOrGuest );

app.use(
  '/person',
  create_api_endpoint({
    schema_name:       'Person',
  })
);

app.use(
  '/organisation',
  create_api_endpoint({
    schema_name:       'Organisation',
  })
);

app.use(
  '/position',
  create_api_endpoint({
    schema_name:       'Position',
  })
);

app.get('/', function (req, res, next) {

  var api_base_url = base_url(req) + '/api/v0.1/';

  res.jsonp({
    comment: "This is the API entry point - use a '*_api_url' link in 'meta' to search a collection.",
    meta: {
      person_api_url: api_base_url + 'person',
      organisation_api_url: api_base_url + 'organisation',
      position_api_url: api_base_url + 'position',
      image_proxy_url: base_url(req) + config.image_proxy.path,
    },
  });
});     

app.get('/about', function (req, res, next) {

  var about_object = about();
  var about_info = about_object.load_about_data(req, function(result){
    res.jsonp({
      'result' : result,
    });
  });
});

// app.all('*', function(req, res, next) {
//   // 404
//   res.jsonp(404, { error: "page not found"});
// });



function create_api_endpoint ( options ) {
  
  var api_endpoint = express();
  
  var marshall_document = function (doc) {
    var result =  doc.toObject();

    // move _id to id
    result.id = result._id;

    // remove the internal fields (anything that starts with '_')
    _.each(_.keys(result), function (key) {
      if ( /^_/.test(key) ) {
        delete result[key];
      }
    });

    return result;
  };

  api_endpoint.param('document_id', function (req, res, next, document_id) {

    // If it is not an ObjectID bail out
    if ( ! utils.is_ObjectId(document_id) ) {
      return res.jsonp( 404, { error: "page not found" } );      
    }

    var model = req.popit.model( options.schema_name );

    var query = model.findById(document_id);
    
    query.exec( function (err, doc) {
      if (err)  return next(err);
      if (!doc) return res.jsonp( 404, { error: "page not found" } );

      // if the document_id is not the id redirect to it
      if ( document_id != doc.id ) {
        var original = req.originalUrl.replace(/\/+$/, '');
        res.redirect(
          resolveUrl(original, './' + doc.id )
        );
      } else {
        res.locals.doc = doc;
        return next();
      }
    });
  });

  api_endpoint.get(  '/', read_collection    );
  api_endpoint.post( '/', create             );
  api_endpoint.put(  '/', method_not_allowed );
  api_endpoint.del(  '/', method_not_allowed );
  
  api_endpoint.get(  '/:document_id', read_document );
  api_endpoint.post( '/:document_id', method_not_allowed );
  api_endpoint.put(  '/:document_id', update_document );
  api_endpoint.del(  '/:document_id', delete_document );
    
  
  function method_not_allowed (req,res) {
    res.jsonp(405, {error: "method not allowed"});
  }
  
  
  function read_collection (req,res,next) {
  
    var model  = req.popit.model(options.schema_name);
    var schema = model.schema;
    var where  = {};
    
    var api_base_url  = base_url(req) + parseUrl(req.originalUrl).pathname + '/';
    api_base_url = api_base_url.replace(/\/+$/, '/');
    var edit_base_url = base_url(req);
  
    // for each query parameter that we know about create a regex search.
    _.each( req.query, function(value, key) {
      if ( schema.path(key) ) {
        
        var key_type = schema.path(key).options.type;
  
        if( key_type == String ) {
          // TODO - default should not be regex but exact
          where[key] = new RegExp( regexp_quote(value), 'i' );
        } else {
          where[key] = value;            
        }
      }
    });
  
    model
      .find(where)
      .exec(function (err, docs) {
        if (err) throw err;
  
        var results = _.map( docs, function (doc) {

          var result = marshall_document(doc);

          result.meta = {
            api_url:  api_base_url  + doc._id,
          };
          
          if (doc.slug_url)
            result.meta.edit_url = edit_base_url + doc.slug_url;
          
          return result;
        });
  
        res.jsonp({
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
  
  
        res.jsonp(400, {errors: errors});
      } else {
        res.set(
          'location',
          base_url(req) + req.originalUrl + '/' + doc.id
        );
  
        res.locals.doc = doc;
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
  
    var doc    = res.locals.doc;
    var result = marshall_document(doc);
    
    // dig down in the result and add meta as needed
    _.keys(result).forEach( function (key) {
      if (_.isArray(result[key])) {
        result[key].forEach( function (item) {
                    
          // TODO improve this hack - we want to add a url to the meta so that this image
          // can be retrieved. And we want to indicate if the image proxy can be used with
          // this url.
          if ( key == 'images' ) {
            item.meta = {};
            if ( item.url ) {
              item.meta.image_url = item.url;
              item.meta.can_use_image_proxy = false;
            } else {
              item.meta.image_url = base_url(req) + doc.slug_url + '/images/' + item._id;
              item.meta.can_use_image_proxy = true;                
            }
          }            
        });
      }
    });
  
    if (doc.slug_url) {
      result.meta = {
        edit_url: base_url(req) + doc.slug_url,
      };
    }
    
    if ( doc.additional_meta ) {
      var additional = doc.additional_meta();
      
      // for all keys ending in '_api_url' add in the current host
      _.each( additional, function (val, key) {
        if ( /api_url$/.test(key) && !/^https?:\/\//.test(val) ) {
          var api_base_url = base_url(req) + '/api/v0.1/';
          additional[key] = api_base_url + val;
        }
      });

      result.meta = _.extend(
        {},
        result.meta,
        additional
      );
    }
        
    res.jsonp( { result: result } );
  }
  
  function update_document ( req, res, next ) {
    var doc  = res.locals.doc;
    var Model  = req.popit.model(options.schema_name);

    var data_to_set = req.body;

    // delete fields that we might be sent but that should not get saved.
    delete data_to_set.id;
    delete data_to_set.meta;

    var new_doc = new Model(
      _.extend(
        {
          _id: doc.id,
          __v: doc.__v
        },
        data_to_set
      )
    );
    
    var data_to_save = new_doc.toObject();

    Model.collection.update(
      { _id: doc._id },
      data_to_save,
      function (err) {
        if (err) return next(err);

        // load the document and store is locals, then return it as normal
        Model.findById(doc._id, function (err, doc) {
          if (err) return next(err);
          res.locals.doc = doc;
          read_document(req,res);          
        });
      }
    );

  }
  
  
  function delete_document (req,res) {
    var doc    = res.locals.doc;
    doc.remove( function(err) {
      if (err) throw err;
  
      // create a flash message for people using the frontend
      if ( req.xhr ) {
        req.flash("info", "Entry '%s' deleted.", doc.name );
      }        
  
      // I'd like to send a 204, but backbone wants an empty JSON hash
      // which jQuery does not seem to pass along unless you use the 200
      // status code - see http://stackoverflow.com/a/7310375/5349
      // res.send(204, ''); // <-- does not work :(
      res.jsonp(200, {});
    
    });
  }
  
  return api_endpoint;
}



