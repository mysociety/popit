"use strict";

var _       = require('underscore'),
    walk    = require('walk'),
    fs      = require('fs'),
    path    = require('path');


var Template = function (args) {
  this.templates = {};
  this.args      = args;

  return this;
};


Template.prototype.loadFromDir = function (dir, callback) {

  var self = this;
  
  var walker  = walk.walk(
    dir,
    { followLinks: false }
  );

  walker.on('file', function(root, stat, next) {

    var template_key = stat.name;
    var filename     = path.join(root, stat.name);

    fs.readFile(
      filename,
      'utf8',
      function(err, content) {
        if (err) throw err;
        self.templates[template_key] = _.template(content);
        next();
      }
    );
  });


  walker.on('end', callback);

};


Template.prototype.render = function ( templateName, data ) {
  var self = this;

  // create a version of this method that is bound to us
  var localRender = function ( templateName, data ) {
    return self.render( templateName, data );
  };

  // add in the function to the data so that it can be called in the templates
  var augmentedData = _.extend(
    {},
    data,
    { render: localRender }
  );

  // run the template and return the results.
  return this.templates[templateName](augmentedData);
};


module.exports = Template;
