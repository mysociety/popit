var generic_document_app      = require('./generic_document');


module.exports = function () {

  var opts = {
    model_name:            'Organisation',
    template_dir:          'organisation',
    template_object_name:  'organisation',
    template_objects_name: 'organisations',
    url_root:              '/organisation',
  };


  var app = generic_document_app(opts);

  app.remove.get('/:slug');

  app.get(
    '/:slug',
    function (req, res, next) {
      res
        .local(opts.template_object_name)
        .find_positions()
        .populate('person')
        .exec(function(err, positions) {
          console.log(positions);
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
