"use strict"; 

var generic_document_app      = require('./generic_document'),
    _                         = require('underscore');


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
    function (route) { return route.path === '/:id'; }
  );

  app.get(
    '/:id',
    function (req, res, next) {
      var finalNext = _.after(2, next);
      res
        .locals[opts.template_object_name]
        .find_memberships()
        .populate('person_id')
        .populate('post_id')
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
    function(req,res) {
      res.render( opts.template_dir + '/view.html' );
    }
  );



  return app;
};
