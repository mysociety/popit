"use strict";

var generic_document_app      = require('./generic_document'),
    _                         = require('underscore'),
    async                     = require('async'),
    mongoose                  = require('mongoose'),
    user                      = require('../authorization');

module.exports = function () {

  var opts = {
    model_name:            'Person',
    template_dir:          'person',
    template_object_name:  'person',
    template_objects_name: 'people',
    url_root:              '/persons',
  };


  var app = generic_document_app(opts);

  app.routes.get = _.reject(
    app.routes.get,
    function (route) { return route.path === '/:id(*)'; }
  );

  app.get(
    '/new',
    function(req,res) {
        var Person = req.popit.model( opts.model_name );
        res.locals[opts.template_object_name] = new Person();
        res.render( opts.template_dir + '/new.html' );
    }
  );

  app.param('id', function(req, res, next) {
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
  });

  app.get('/:id(*)/edit', user.can('edit instance'), function(req, res, next) {
    res.render( opts.template_dir + '/edit.html' );
  });

  app.get('/:id(*)', function(req, res) {
    res.render( opts.template_dir + '/view.html' );
  });

  // Process person's memberships
  app.put('/:id(*)', user.can('edit instance'), function(req, res, next) {
    var memberships = req.body.memberships;
    delete req.body.memberships;

    // we have to do this here otherwise it's impossible to delete
    // a single membership. The map reduces it to a list of ids, the
    // compact removed the undefined ids of any new memberships. The
    // second step is required otherwise the find and remove doesn't
    // work if there are new memberships
    var Membership = req.db.model('Membership');
    var membership_ids =
      _.chain(memberships)
       .map( function(membership) { return membership.id; })
       .compact()
       .value();

    Membership
      .find( { 'person_id': req.param('id') } )
      .where( '_id' ).nin( membership_ids )
      .exec( function( err, memberships ) {
        if ( err ) {
          next(err);
        }
        async.forEachSeries(memberships, function(membership, done) {
          membership.remove(done);
        });
      });

    if (!memberships) {
      return next();
    }

    var Organization = req.db.model('Organization');

    var updateMembership = function(membership, done) {
      Membership.findById(membership.id, function(err, doc) {
        if (err) {
          return done(err);
        }
        if (!doc) {
          var objectId = new mongoose.Types.ObjectId();
          doc = new Membership({_id: objectId.toHexString()});
        }
        doc.set(membership);
        doc.save(done);
      });
    };

    async.forEachSeries(memberships, function(membership, done) {
      Organization.findById(membership.organization_id, function(err, organization) {
        if (err) {
          return done(err);
        }
        // Create organization if it doesn't exist
        if (!organization) {
          var objectId = new mongoose.Types.ObjectId();
          organization = new Organization({_id: objectId.toHexString(), name: membership.organization_name});
          membership.organization_id = organization._id;
          delete membership.organization_name;
          organization.save(function(err) {
            if (err) {
              return done(err);
            }

            updateMembership(membership, done);
          });
        } else {
          delete membership.organization_name;
          updateMembership(membership, done);
        }

      });
    }, next);
  });

  // Save changes to person model
  app.put('/:id(*)', user.can('edit instance'), function(req, res, next) {
    var Person = req.db.model('Person');
    Person.findById(req.param('id'), function(err, person) {
      if (err) {
        return next(err);
      }
      person.set(req.body);
      /* we need to explicitely remove these if they are undefined
       * as .set will not remove existing data which means it will
       * never delete a single entry or all entries */
      [
        'other_names',
        'contact_details',
        'memberships',
        'identifiers',
        'links'
      ].forEach(function(field) {
        if ( req.body[field] === undefined ) {
          person[field] = undefined;
        }
      });
      person.save(function(err, person) {
        if (err) {
          return next(err);
        }
        if ( req.param('_add_another') == 1 ) {
          res.redirect('/persons/new');
        } else {
          // there is a bug that means we sometimes failed to create the id
          // key so fallback to _id if that's the case
          var id = person.id ? person.id : person._id;
          res.redirect('/persons/' + id);
        }
      });
    });
  });

  return app;
};
