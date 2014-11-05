"use strict"; 

var express            = require('../express-inherit'),
    winston            = require('winston'),
    Error404           = require('../errors').Error404,
    image              = require('./image'),
    utils              = require('../utils'),
    _                  = require('underscore'),
    async              = require('async'),
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
    relatedObject: function(membership, object) {
      if (opts.model_name === 'Person') {
        if (membership.person_id && membership.person_id.id !== object.id) {
          return membership.person_id;
        } else if (membership.organization_id) {
          return  membership.organization_id;
        } else if (membership.post_id) {
          return membership.post_id.organization_id;
        } else {
          return membership.memberObject;
        }
      } else if (opts.model_name === 'Organization') {
        if (membership.organization_id && membership.organization_id.id !== object.id) {
          return membership.organization_id;
        } else if (membership.person_id) {
          return membership.person_id;
        } else {
          return membership.memberObject;
        }
      } else if (opts.model_name === 'Post') {
        if (membership.organization_id) {
          return membership.organization_id;
        } else if (membership.memberObject) {
          return membership.memberObject;
        } else {
          return object.organization_id;
        }
      }
    },
    validMembership: function(membership, objectId) {
      if (opts.model_name === 'Person') {
        if (membership.organization_id || membership.post_id) {
          return true;
        } else if (membership.person_id && membership.person_id.id !== objectId) {
          return true;
        } else {
          return false;
        }
      } else if (opts.model_name === 'Organization') {
        if (membership.person_id) {
          return true;
        } else if (membership.organization_id && membership.organization_id.id !== objectId) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
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
        q.populate('organization_id');
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
  }, function findMemberships(req, res, next) {
    res
      .locals[opts.template_object_name]
      .find_memberships()
      .populate('organization_id')
      .populate('post_id')
      .populate('person_id')
      .exec(function(err, memberships) {
        res.locals.memberships = memberships;
        next(err);
      });
  }, function findMembershipMember(req, res, next) {
    async.forEach(res.locals.memberships, function(membership, done) {
      var member = membership.get('member');
      if (!member) {
        return done();
      }
      var Collection = req.popit.model(member['@type']);
      Collection.findById(member.id, function(err, member) {
        if (err) {
          return done(err);
        }
        membership.memberObject = member;
        done();
      });
    }, next);
  }, function findMembershipPostOrganization(req, res, next) {
    async.forEach(res.locals.memberships, function(membership, done) {
      var post = membership.get('post_id');
      if (!post) {
        return done();
      }
      post.populate('organization_id', done);
    }, next);
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
