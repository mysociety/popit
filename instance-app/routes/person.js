var Error404 = require('../../lib/errors').Error404;


exports.route = function (app) {

  app.get('/person', function (req,res) {
    var query = req.popit.model('Person').find().asc('name');

    query.run(function(err, docs) {
      if (err) throw err;
      
      res.local('people', docs);
      res.render('person_list');
    });
  });

  function requireUser(req, res, next) {
    // FIXME - check that we have a user
    next();
  }

  function person_new_display_form (req, res) {
    if( ! res.local('errors') ) res.local('errors', {} );
    res.render( 'person_new' );    
  }

  app.get( '/person/new', requireUser, person_new_display_form );
      
  app.post('/person/new', requireUser, function(req, res) {
    var PersonModel = req.popit.model('Person');
        
    var person = new PersonModel({
      name: req.param('name'),
    });

    person.save(function(err, obj){
      if ( err ) {
        res.local( 'errors', err['errors'] );
        return person_new_display_form(req,res);
      } else {
        res.redirect( '/person/' + obj.id );        
      }
    });
    
  });


  app.param('personId', function loadPerson (req, res, next, id) {
    req.popit.model('Person').findById(id, function(err, doc) {
      if (err) console.log( err );
      if (!doc) {
        next( new Error404() );
      } else {
        res.local('person', doc);
        next();
      }
    });
  });


  app.get('/person/:personId', function(req,res) {
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
  
        // FIXME - should not be hardcoded
        res.redirect('/person/' + object.id);      
      });
    };
  
    var edit_form = function (req,res) {
      res.render("generic_form");
    };
      
    app.get(  options.base_path + '/edit', options.middleware, edit_form_prep, edit_form );
    app.post( options.base_path + '/edit', options.middleware, edit_form_prep, edit_post );

  }
    
  create_edit_form({
    base_path: '/person/:personId',
    form_fields: ['name','summary', 'foo.bar'],
    middleware: requireUser,
    object_key: 'person',
  });


};
