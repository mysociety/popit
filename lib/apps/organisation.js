var express       = require('express'),
    Error404      = require('../errors').Error404,
    path          = require('path'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs'),
    requireUser   = require('../middleware/route').requireUser,
    _             = require('underscore');


module.exports = function () {

  var app = express.createServer();
  
  
  app.mounted(function(parent){
  
    var app = this;
  
    app.get('/', function (req,res) {
  
      var query = req.popit.model('Organisation').find().asc('name');
      
      query.run(function(err, docs) {
        if (err) throw err;
        
        res.local('organisations', docs);
        res.render('organisation');
      });
    });
      
    function organisation_new_display_form (req, res, next) {
      if( ! res.local('errors') ) res.local('errors', {} );
      if( ! res.local('organisation') ) res.local('organisation', {} );
      res.render( 'organisation/new' );    
    }
    
    app.get( '/new', requireUser, organisation_new_display_form );
        
    app.post('/new', requireUser, function(req, res) {
      var OrganisationModel = req.popit.model('Organisation');
          
      var organisation = new OrganisationModel({
        name: req.param('name', ''),
        slug: req.param('slug', ''),
      });
      
      if (organisation.name && !organisation.slug) {
        res.locals({ require_slug: true, organisation: organisation });
        return organisation_new_display_form(req,res);
      }
    
      organisation.deduplicate_slug(function(err){
        if (err) return next(err);
        organisation.save(function(err, obj){
          if ( err ) {
            res.local( 'errors', err['errors'] );
            return organisation_new_display_form(req,res);
          } else {
            res.redirect( obj.slug_url );        
          }
        });      
      });    
    });
    
    app.get('/autocomplete_name', function (req,res) {
      var term = req.param('term');
      if (!term) return res.json([]);

      req.popit
        .model('Organisation')
        .find()
        .select('name','slug')
        .regex('name', new RegExp("" + term, 'i') ) // FIXME - replace with something smarter - most likely something search engine based
        .run(function(err,docs) {
          if (err) throw err;
          
          var suggestions = _.map(docs, function(item) {
            return {label: item.name, value: item.slug };
          });

          res.json(suggestions);
        });

    });
    
    
    app.param('organisationSlug', function loadOrganisation (req, res, next, slug) {
      req.popit.model('Organisation').findOne({slug: slug}, function(err, doc) {
        if (err) console.log( err );
        if (!doc) {
          next( new Error404() );
        } else {
          res.local('organisation', doc);
          next();
        }
      });
    });
    
      
    app.get('/:organisationSlug', function(req,res) {
      res.render('organisation/view');
    });
    
    app.get('/:organisationSlug/json', function(req,res) {
      res.json( res.local('organisation') );
    });
  
  });
  
  return app;
};