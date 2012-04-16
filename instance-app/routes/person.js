exports.route = function (app) {

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
      if (err) throw err;
      if (!doc) throw new Error('PageNotFound');
      res.local('person', doc);
      next();
    });
  });


  app.get('/person/:personId', function(req,res) {
    res.render('person_view');
  });

    
  app.get('/person/:personId/edit', requireUser, function(req,res) {
    res.json({
      params: req.params,
      query: req.query,
      body: req.body,
    });
  });

};
