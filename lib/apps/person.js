var express       = require('express'),
    Error404      = require('../errors').Error404;


module.exports = function () {

  var app = express.createServer();
  
  
  app.mounted(function(parent){
  
    var app = this;
  
    app.get('/', function (req,res) {
  
      var query = req.popit.model('Person').find().asc('name');
      
      query.run(function(err, docs) {
        if (err) throw err;
        
        res.local('people', docs);
        res.render('person_list');
      });
    });
  
    // TODO - move out to shared route middleware
    function requireUser(req, res, next) {
      // if we have a user then continue
      if ( req.user ) return next();
    
      var host     = req.headers.host;
      var tls      = req.connection.encrypted;
      var base_url = 'http' + (tls ? 's' : '') + '://' + host;
  
      // Express 2.5.9 handles redirects that start with '/' by homing them at 
      // the mounted apps base. Which is wrong. Use full url to avoid this issue.
      // Store our url on the session and get the user to log in.
      req.session.post_login_redirect_to = base_url + '/person/new';    
      res.redirect( base_url + '/login' );
    }
    
    function person_new_display_form (req, res, next) {
      if( ! res.local('errors') ) res.local('errors', {} );
      if( ! res.local('person') ) res.local('person', {} );
      res.render( 'person_new' );    
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
    
      person.deduplicate_slug(function(err){
        if (err) return next(err);
        person.save(function(err, obj){
          if ( err ) {
            res.local( 'errors', err['errors'] );
            return person_new_display_form(req,res);
          } else {
            res.redirect( obj.slug_url );        
          }
        });      
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
    
    
    app.get('/:personSlug', function(req,res) {
      res.render('person_view');
    });
    
    function create_edit_form ( options ) {
    
      var edit_form_prep = function (req, res, next) {
        res.locals({
          form_fields: options.form_fields,
          errors:     {},
          object:     res.local( options.object_key ), 
        });
        next();
      };
    
      var edit_post = function (req,res) {
        var object = res.local('object');
    
        res.local('form_fields').forEach( function (key) {
          object.set( key, req.param(key, null) );
        });
    
        object.save(function(err, doc) {
    
          if ( err ) {
            res.local('errors', err.errors );
            return edit_form(req,res);
          }
    
          res.redirect( object.slug_url );      
        });
      };
    
      var edit_form = function (req,res) {
        res.render("generic_form");
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
  
  });
  
  return app;
};