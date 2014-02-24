"use strict"; 

var express            = require('../express-inherit'),
    winston            = require('winston'),
    Error404           = require('../errors').Error404,
    requireUserOrGuest = require('../apps/auth').requireUserOrGuest,
    image              = require('./image'),
    utils              = require('../utils');


/*

  Generic app for documents. Takes a hash of options that configures it:
  
  var opts = {
    model_name:            'Person',
    template_dir:          'person',
    template_object_name:  'person',
    template_objects_name: 'people',
    url_root:              '/person',
  };
  

*/

module.exports = function (opts) {

  var app = express();

  app.locals({
    image_proxy: utils.image_proxy_helper
  });

  app.get('/', function (req,res,next) {
    var search = req.param('name');
    if (search) {

      req.popit.model(opts.model_name).name_search(search, function(err, names) {
        if (err) return next(err);
        if ( names.length && names.length == 1 ) {
          return res.redirect(names[0].url);
        }
        res.locals.results = names;
        res.render('search.html');
      });

    } else {

      var query = req.popit.model(opts.model_name).find().sort('name');
      query.exec(function(err, docs) {
        if (err) throw err;
        res.locals[opts.template_objects_name] = docs;
        res.render(opts.template_dir + '/index.html');
      });

    }
  });    
  

  app.param('id', function loadDocumentById (req, res, next, id) {
    var q = req.popit.model( opts.model_name ).findOne( { _id: id } );
    if ( opts.model_name == 'Organization' ) {
        q.populate('parent_id');
    }
    q.exec(function(err, doc) {
      if (err) winston.error( err );
      if (!doc) {
        next( new Error404() );
      } else {
        res.locals[opts.template_object_name] = doc;
        req.object = doc;
        next();
      }
    });
  });
  
  
  app.get(  '/:id/images/upload', requireUserOrGuest, image.upload_image );
  app.post( '/:id/images/upload', requireUserOrGuest, image.upload_image );
  app.get(  '/:id/images/:image_spec', image.get );
  app.post( '/:id/images/:image_spec/delete', requireUserOrGuest, image.delete );


  app.get('/:id', function(req,res) {
    res.render( opts.template_dir + '/view.html' );
  });

  return app;
};
