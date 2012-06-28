var express       = require('express'),
    Error404      = require('../errors').Error404,
    path          = require('path'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs'),
    requireUser   = require('../middleware/route').requireUser,
    image         = require('./image');


module.exports = function () {

  var app = express.createServer();
  
  
  app.mounted(function(parent){
  
    var app = this;
  
    app.get('/', function (req,res) {
  
      var query = req.popit.model('Person').find().asc('name');
      
      query.run(function(err, docs) {
        if (err) throw err;
        
        res.local('people', docs);
        res.render('person');
      });
    });    
    
    app.param('personSlug', function loadPerson (req, res, next, slug) {
      req.popit.model('Person').findOne({slug: slug}, function(err, doc) {
        if (err) console.log( err );
        if (!doc) {
          next( new Error404() );
        } else {
          res.local('person', doc);
          req.object = doc;
          next();
        }
      });
    });
    
    function buildExtractObjectId(from, locals_name) {
      return function extractObjectId (req, res, next, id) {

        var person = res.local('person');
        var target = person[from];

        var object = null;

        if ( id === 'new') {
          target.push({});
          object = target[ target.length - 1 ];
        } else {
          object = target.id(id);
        };

        if ( !object) return next( new Error404() );

        res.local( locals_name, object );

        next();
      };
    }
    
    app.param('contactId', buildExtractObjectId( 'contact_details', 'contact' ) );
    app.param('linkId',    buildExtractObjectId( 'links',           'link'    ) );

    function load_positions (req, res, next) {
      res
        .local('person')
        .find_positions()
        .populate('organisation')
        .run(function(err, positions) {
          res.local('positions', positions );
          next(err);
        });
    }

    app.get('/:personSlug', load_positions, function(req,res) {
      res.render('person/view');
    });
        
    function create_edit_form ( options ) {
    
      var edit_form_prep = function (req, res, next) {
        res.locals({
          form_fields: options.form_fields,
          errors:      {},
          object:      res.local( options.object_key ), 
          save_object: res.local( options.save_object_key || options.object_key ), 
        });
        next();
      };
    
      var edit_post = function (req,res) {
        var object      = res.local('object');
        var save_object = res.local('save_object');
    
        res.local('form_fields').forEach( function (key) {
          object[key] = req.param(key, null);
        });
    
        save_object.save(function(err, doc) {
    
          if ( err ) {
            console.log(err);
            res.local('errors', err.errors );
            return edit_form(req,res);
          }
    
          res.redirect( save_object.slug_url );      
        });
      };
    
      var edit_form = function (req,res) {
        res.render( options.edit_template || "generic_form" );
      };
        
      app.get(  options.base_path + '/edit', options.middleware, edit_form_prep, edit_form );
      app.post( options.base_path + '/edit', options.middleware, edit_form_prep, edit_post );
    
    }
      
    create_edit_form({
      base_path: '/:personSlug',
      form_fields: ['name','summary'],
      middleware: requireUser,
      object_key: 'person',
    });
  
    create_edit_form({
      base_path: '/:personSlug/contacts/:contactId',
      form_fields: ['kind','value'],
      middleware: requireUser,
      object_key: 'contact',
      save_object_key: 'person',
    });
  
    create_edit_form({
      base_path: '/:personSlug/links/:linkId',
      form_fields: ['url','comment'],
      middleware: requireUser,
      object_key: 'link',
      save_object_key: 'person',
    });
      
    app.get(  '/:personSlug/images/upload', requireUser, image.upload_image );
    app.post( '/:personSlug/images/upload', requireUser, image.upload_image );
    app.get(  '/:personSlug/images/:image_spec', image.get );
    app.post( '/:personSlug/images/:image_spec/delete', requireUser, image.delete );
    
  });
  
  
  function position_add_load_organisation (req,res,next) {
    var org_slug = req.param('organisation_slug');
    var org_name = req.param('organisation_name');
    var Organisation = req.popit.model('Organisation');
    
    // try to load the org from the slug
    if ( org_slug ) {
      Organisation.findOne(
        { slug: org_slug },
        function (err, org) {
          if (err)  throw err;
          if (!org) throw new Error404();
          res.local('organisation', org);          
          next();
        }
      );
      return;
    }

    if (org_name) {
      // Have a name but no slug. Create a new org
      var org = new Organisation({ name: org_name });
      org.save(function(err){
        if (err) throw err;
        res.local('organisation', org);
        next();
      });
      return;
    }
    
    next();
  }
  
  function position_add_handle_post (req,res,next) {
    var org    = res.local('organisation');
    var person = res.local('person');
    var title  = req.param('title');
    var Position = req.popit.model('Position');

    // Can't create a position without an org
    if (!org) {
      return next();
    }
    
    // need a title too
    if (!title) {
      return next();
    }
    
    // all set, create the org and redirect back to the person page
    var pos = new Position({
      title: title,
      organisation: org,
      person: person,
    });
    pos.save(function(err) {
      if (err) throw err;
      res.redirect( '/' + person.slug );                  
    });
  }

  function position_add_show_form (req, res) {
    res.local( 'show_organisation', true );
    if (!res.local('position')) res.local('position', {});
    if (!res.local('organisation')) res.local('organisation', {});
    res.render('position/add');    
  }  

  app.get(
    '/:personSlug/position/add',
    requireUser,
    position_add_load_organisation,
    position_add_show_form
  );
  
  app.post(
    '/:personSlug/position/add',
    requireUser,
    position_add_load_organisation,
    position_add_handle_post,
    position_add_show_form
  );
  
  
  
  
  return app;
};
