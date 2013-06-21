"use strict"; 

var generic_document_app      = require('./generic_document'),
    _                         = require('underscore');


module.exports = function () {

  var opts = {
    model_name:            'Organization',
    template_dir:          'organization',
    template_object_name:  'organization',
    template_objects_name: 'organizations',
    url_root:              '/organization',
  };


  var app = generic_document_app(opts);

  app.routes.get = _.reject(
    app.routes.get,
    function (route) { return route.path === '/:slug'; }
  );

  app.get(
    '/:slug',
    function (req, res, next) {
      res
        .locals[opts.template_object_name]
        .find_positions()
        .populate('person')
        .exec(function(err, positions) {
          res.locals.positions = positions;
          next(err);
        });
    },
    function(req,res) {
      res.render( opts.template_dir + '/view.html' );
    }
  );



  return app;
};
