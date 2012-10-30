"use strict";

var _       = require('underscore'),
    walk    = require('walk'),
    fs      = require('fs'),
    path    = require('path');



module.exports.getTemplates = function( args, callback ) {
  
  var templates = {};
  
  // Walker options
  var walker  = walk.walk(
    __dirname + '/sample_templates',
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
        templates[template_key] = _.template(content);;
        next();
      }
    );
  });


  walker.on('end', function() {

    var wrapped_templates = {};

    var render = function (key, data) {
      return wrapped_templates[key](data);
    };

    _.each(templates, function(compiled, key) {

      var wrapped = function (data, settings) {
        return compiled(
          _.extend({}, data, {render: render} ),
          settings
        );
      };

      wrapped.original = compiled;

      wrapped_templates[key] = wrapped;

    });

    callback(null, wrapped_templates);

  });

};



// var module_template_content = fs.readFileSync(__dirname + '/templates.js.tmpl', 'utf8');

// walker.on('end', function() {
//     console.log(templates);
// 
//     console.log(
//       _.template( module_template_content, { templates: templates })
//     );
// 
// });


