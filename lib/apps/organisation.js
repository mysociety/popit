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
  return app;
};
