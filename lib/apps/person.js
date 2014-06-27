"use strict";

var generic_document_app      = require('./generic_document'),
    _                         = require('underscore'),
    async                     = require('async'),
    mongoose                  = require('mongoose');

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
    },
    function (req, res, next) {
      // Find the primary party for this person.
      var Membership = req.popit.model('Membership');
      Membership.findOne({person_id: req.param('id'), _primary: true})
        .populate('organization_id')
        .exec(function(err, membership) {
          if (err) {
            return next(err);
          }
          if (membership) {
            var person = res.locals[opts.template_object_name];
            person.party = membership.organization_id;
            if (membership.area) {
              person.constituency = membership.area.name;
            }
          }
          next();
        });
    }
  );

  app.get('/:id(*)/edit', function(req, res, next) {
    res.render( opts.template_dir + '/edit.html' );
  });

  app.get('/:id(*)', function(req, res) {
    res.render( opts.template_dir + '/view.html' );
  });

  // Process person's memberships
  app.put('/:id(*)', function(req, res, next) {
    var memberships = req.body.memberships;
    delete req.body.memberships;
    if (!memberships) {
      return next();
    }
    var Organization = req.db.model('Organization');
    var Membership = req.db.model('Membership');

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
        }
        delete membership.organization_name;
        organization.save(function(err) {
          if (err) {
            return done(err);
          }

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
        });

      });
    }, next);
  });

  // Process person's primary membership
  app.put('/:id(*)', function(req, res, next) {
    if (!req.body.organization) {
      return next();
    }
    var Organization = req.db.model('Organization');
    Organization.findOne({$or: [{_id: req.body.organization_id}, {name: req.body.organization}]}, function(err, org) {
      if (err) {
        return next(err);
      }
      if (!org) {
        var objectId = new mongoose.Types.ObjectId();
        org = new Organization({_id: objectId.toHexString()});
      }

      org.name = req.body.organization;

      // Remove the organization now we've processed so it doesn't get persisted
      delete req.body.organization;
      delete req.body.organization_id;

      org.save(function(err) {
        if (err) {
          return next(err);
        }

        // Now create a membership for these two organizations.
        var Membership = req.db.model('Membership');
        var membershipParams = {organization_id: org._id, person_id: req.param('id'), _primary: true};
        Membership.findOne(membershipParams, function(err, membership) {
          if (err) {
            return next(err);
          }
          if (!membership) {
            var objectId = new mongoose.Types.ObjectId();
            membership = new Membership(membershipParams);
            membership._id = objectId.toHexString();
          }

          membership.set('area.name', req.body['membership-area']);
          delete req.body['membership-area'];

          membership.save(next);
        });
      });
    });
  });

  // Save changes to person model
  app.put('/:id(*)', function(req, res, next) {
    var Person = req.db.model('Person');
    Person.findById(req.param('id'), function(err, person) {
      if (err) {
        return next(err);
      }
      person.set(req.body);
      person.save(function(err, person) {
        if (err) {
          return next(err);
        }
        // there is a bug that means we sometimes failed to create the id
        // key so fallback to _id if that's the case
        var id = person.id ? person.id : person._id;
        res.redirect('/persons/' + id);
      });
    });
  });

  return app;
};
