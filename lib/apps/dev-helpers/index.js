var express    = require('express'),
    utils      = require('../../utils'),
    PopIt      = require('../../popit'),
    config     = require('config'),
    fixtures   = require('pow-mongodb-fixtures');

module.exports = function () {

  var app = express.createServer();

  // belt and braces - throw if we are not in dev or testing mode
  if (app.settings.env != 'development' && app.settings.env != 'testing') {
    throw new Error("dev_helpers should only be loaded in 'development' or 'testing', not '" + app.settings.env + "'");
  }
  
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  app.set('view options', { layout: false, pretty: true, });

  // update the master database to contain the instance, set its status to
  // active and then redirect the blowser to that instance's dev page.
  app.post('/add_instance_to_master', function(req,res,next) {
    console.log('add_instance_to_master');
    var instance_slug = req.param('instance_slug');
    if (!instance_slug)
      throw new Error("need an 'instance_slug'");

    var Instance = req.popit.model('Instance');
    Instance.update(
      {
        slug:   instance_slug,
      },
      {
        email:  'test@example.com',
        status: 'active',
      },
      {upsert: true},
      function(err) {
        if (err) return next(err);

        // When done redirect the user to this instance
        res.redirect(utils.instance_base_url_from_slug(instance_slug) + '/_dev');
      }
    );

  });
  
  
  // Delete the current instance database
  app.post('/delete_this_instance_database', function(req,res,next) {
    console.log('delete_this_instance_database');
    var db = req.popit.instance_db().db;
    
    db.dropDatabase(function(err) {
        if (err) return next(err);
        db.close();
        res.local('message', 'OK - database deleted');
        next();
    });
  });
  
  
  // Load the testing fixture
  app.post('/load_testing_fixture', function (req,res,next) {
    console.log('load_testing_fixture');

    var instance = fixtures.connect( config.MongoDB.popit_prefix + req.popit.instance_name() );

    instance.load( '../fixtures/foobar_instance.js', function (err) {
      if (err) return next(err);
      instance.db.close();
      res.local('message','OK - test fixtures loaded');            
      next();
    });
    
  });


  // Show the index page with a message
  function show_index_page (req,res) {
    res.render('index');
  }

  // all posts should fall through having set a message to be shown
  app.post('*', show_index_page );

  // index page
  app.get('/', show_index_page  );
  
  // Catch all remaining gets and send them to the index page
  app.get('*', function(req,res) {
    res.redirect('/')
  });


  return app;
};
