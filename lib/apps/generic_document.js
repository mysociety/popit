"use strict"; 

var express            = require('../express-inherit'),
    winston            = require('winston'),
    Error404           = require('../errors').Error404,
    image              = require('./image'),
    utils              = require('../utils'),
    _                  = require('underscore'),
    user               = require('../authorization');


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

  app.locals({
    image_url: function(type, object, image) {
      return '/' + type + 's/images/' + image.id + '/' + object.id;
    },
    relatedObject: function(membership, objectId) {
      if (opts.model_name === 'Person') {
        if (membership.person_id && membership.person_id.id !== objectId) {
          return membership.person_id;
        } else if (membership.organization_id) {
          return  membership.organization_id;
        } else {
          return membership.memberObject;
        }
      } else if (opts.model_name === 'Organization') {
        if (membership.organization_id && membership.organization_id.id !== objectId) {
          return membership.organization_id;
        } else if (membership.person_id) {
          return membership.person_id;
        } else {
          return membership.memberObject;
        }
      }
    },
    validMembership: function(membership, objectId) {
      return (
        opts.model_name === 'Person' &&
        (membership.organization_id || (membership.person_id && membership.person_id.id !== objectId))
      ) || (
        opts.model_name === 'Organization' &&
        (membership.person_id || (membership.organization_id && membership.organization_id.id !== objectId))
      ) || membership.memberObject;
    }
  });

  // Remove null values from arrays
  app.put('/:id(*)', function(req, res, next) {
    [
      'other_names',
      'contact_details',
      'memberships',
      'identifiers',
      'links'
    ].forEach(function(field) {
      if (!req.body[field]) {
        req.body[field] = undefined;
        return;
      }
      req.body[field] = req.body[field].filter(function(item) {
        if ( !_.isNull(item) ) {
          item = _.compact(item);
          return item.length > 0;
        }
        return false;
      });
    });
    next();
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
    if ( opts.model_name == 'Post' ) {
        q.populate('organization_id person_id');
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
  
  
  app.get(  '/:id(*)/images/upload', user.can('edit instance'), image.upload_image );
  app.post( '/:id(*)/images/upload', user.can('edit instance'), image.upload_image );
  app.get(  '/:id/image/:image_spec', image.get );
  app.get(  '/images/:image_spec/:id(*)', image.get );
  app.post( '/images/:image_spec/:id(*)/delete', user.can('edit instance'), image.delete );


  app.get('/:id(*)', function(req,res) {
    res.render( opts.template_dir + '/view.html' );
  });

  return app;
};
