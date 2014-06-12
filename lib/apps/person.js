"use strict";

var generic_document_app      = require('./generic_document'),
    _                         = require('underscore');


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

  app.post('/:id(*)', function(req, res, next) {
    res.send(req.body);
  });

  return app;
};
