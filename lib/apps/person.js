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

  app.get('/:id(*)/edit', function(req, res, next) {
    var Person = req.popit.model( opts.model_name );
    Person.findById(req.param('id'), function(err, person) {
      if (err) {
        return next(err);
      }
      res.locals[opts.template_object_name] = person;
      res.render( opts.template_dir + '/edit.html' );
    });
  });

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
        res.redirect('/persons/' + person.id);
      });
    });
  });

  return app;
};
