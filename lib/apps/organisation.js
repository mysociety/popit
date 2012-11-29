"use strict"; 

var generic_document_app      = require('./generic_document'),
    _                         = require('underscore');


module.exports = function () {

  var opts = {
    model_name:            'Organisation',
    template_dir:          'organisation',
    template_object_name:  'organisation',
    template_objects_name: 'organisations',
    url_root:              '/organisation',
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
