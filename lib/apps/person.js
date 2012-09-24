var express       = require('express'),
    Error404      = require('../errors').Error404,
    path          = require('path'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs'),
    requireUser   = require('../middleware/route').requireUser,
    image         = require('./image'),
    utils         = require('../utils');


module.exports = function () {

  var app = express.createServer();

  app.helpers({
    image_proxy: utils.image_proxy_helper
  });

  app.get('/', function (req,res) {
    var search = req.param('name');
    if (search) {

      req.popit.model('Person').name_search(search, function(names) {
        if ( names.length && names.length == 1 ) {
          return res.redirect( '/person/' + names[0].slug );
        }
        res.local('results', names);
        res.render('search');
      });

    } else {

      var query = req.popit.model('Person').find().sort('name');
      query.exec(function(err, docs) {
        if (err) throw err;
        res.local('people', docs);
        res.render('person');
      });

    }
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
  
  function load_positions (req, res, next) {
    res
      .local('person')
      .find_positions()
      .populate('organisation')
      .exec(function(err, positions) {
        res.local('positions', positions );
        next(err);
      });
  }

    

  app.get(  '/:personSlug/images/upload', requireUser, image.upload_image );
  app.post( '/:personSlug/images/upload', requireUser, image.upload_image );
  app.get(  '/:personSlug/images/:image_spec', image.get );
  app.post( '/:personSlug/images/:image_spec/delete', requireUser, image.delete );



  app.get('/:personSlug', load_positions, function(req,res) {
    res.render('person/view');
  });


  return app;
};
