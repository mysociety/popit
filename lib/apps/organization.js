"use strict"; 

var generic_document_app      = require('./generic_document'),
    _                         = require('underscore'),
    async                     = require('async');

module.exports = function () {

  var opts = {
    model_name:            'Organization',
    template_dir:          'organization',
    template_object_name:  'organization',
    template_objects_name: 'organizations',
    url_root:              '/organizations',
  };


  var app = generic_document_app(opts);

  app.routes.get = _.reject(
    app.routes.get,
    function (route) { return route.path === '/:id(*)'; }
  );

  app.get(
    '/new',
    function(req,res) {
        var Organization = req.popit.model( opts.model_name );
        res.locals[opts.template_object_name] = new Organization();
        res.render( opts.template_dir + '/new.html' );
    }
  );

  app.get(
    '/:id(*)',
    function (req, res, next) {
      var finalNext = _.after(2, next);
      res
        .locals[opts.template_object_name]
        .find_memberships()
        .populate('person_id')
        .populate('post_id')
        .populate('organization_id')
        .exec(function(err, memberships) {
          res.locals.memberships = memberships;
          finalNext(err);
        });
      res
        .locals[opts.template_object_name]
        .find_posts(function(err, posts) {
          res.locals.posts = posts;
          finalNext(err);
        });
    },
    function findMembershipMember(req, res, next) {
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
    },
    function(req,res) {
      res.render( opts.template_dir + '/view.html' );
    }
  );



  return app;
};
