"use strict";

var generic_document_app = require('./generic_document');

var app = module.exports = generic_document_app({
  model_name: 'Post',
  template_dir: 'post',
  template_object_name: 'post',
  template_objects_name: 'posts',
  url_root: '/posts',
});
