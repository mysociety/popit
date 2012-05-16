var express       = require('express'),
    Error404      = require('../errors').Error404,
    path          = require('path'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs'),
    requireUser   = require('../middleware/route').requireUser;


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
      
    function person_new_display_form (req, res, next) {
      if( ! res.local('errors') ) res.local('errors', {} );
      if( ! res.local('person') ) res.local('person', {} );
      res.render( 'person/new' );    
    }
    
    app.get( '/new', requireUser, person_new_display_form );
        
    app.post('/new', requireUser, function(req, res) {
      var PersonModel = req.popit.model('Person');
          
      var person = new PersonModel({
        name: req.param('name', ''),
        slug: req.param('slug', ''),
      });
      
      if (person.name && !person.slug) {
        res.locals({ require_slug: true, person: person });
        return person_new_display_form(req,res);
      }
    
      person.save(function(err, obj){
        if ( err ) {
          res.local( 'errors', err['errors'] );
          return person_new_display_form(req,res);
        } else {
          res.redirect( obj.slug_url );        
        }
      });    
    });
    
    
    app.param('personSlug', function loadPerson (req, res, next, slug) {
      req.popit.model('Person').findOne({slug: slug}, function(err, doc) {
        if (err) console.log( err );
        if (!doc) {
          next( new Error404() );
        } else {
          res.local('person', doc);
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
      
      
    function upload_image_get ( req, res ) {
      res.render('person/upload_image');
    }
    
    function upload_image_post ( req, res ) {
      console.log( req.files );

      if ( !req.files ) return upload_image_get(req,res);

      var upload = req.files.image;
      if (!upload.size) return upload_image_get(req,res);
      
      // FIXME - don't trust that we have an image
      
      // create an image object
      var image = new (req.popit.model('Image'))({
        mime_type: upload.type
      });

      var dest_path = req.popit.files_dir( image.local_path_original );

      // copy the image to the right place
      mkdirp( path.dirname(dest_path), function (err) {
        if (err) throw err;
        fs.rename( upload.path, dest_path, function(err) {
          if (err) throw err;

          // save the image
          image.save( function(err) {
            if (err) throw err;

            // add image to person and save
            var person = res.local('person');
            person.images.push(image);
            person.save(function(err) {
              if (err) throw err;
              // redirect to the person
              res.redirect( '/' + person.slug_url );                  
            })
          })
        });        
      })      
    }
    
    app.get(  '/:personSlug/upload_image', requireUser, upload_image_get  );
    app.post( '/:personSlug/upload_image', requireUser, upload_image_post );
    
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