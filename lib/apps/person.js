var generic_document_app      = require('./generic_document');


module.exports = function () {

  var opts = {
    model_name:            'Person',
    template_dir:          'person',
    template_object_name:  'person',
    template_objects_name: 'people',
    url_root:              '/person',
  };


  var app = generic_document_app(opts);


  app.remove.get('/:slug');

  app.get(
    '/:slug',
    function (req, res, next) {
      res
        .local(opts.template_object_name)
        .find_positions()
        .populate('organisation')
        .exec(function(err, positions) {
          res.local('positions', positions );
          next(err);
        });
    },
    function(req,res) {
      res.render( opts.template_dir + '/view' );
    }
  );


  return app;
};
