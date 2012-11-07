"use strict";

var _       = require('underscore'),
    walk    = require('walk'),
    fs      = require('fs'),
    path    = require('path');


var Template = function (args) {
  args = args || {};
  this.templates  = {};
  this.args       = args;
  this.loadedDirs = {};
  this.cacheTemplates = args.cacheTemplates || false;

  return this;
};


Template.prototype.loadFromDir = function (dir, callback) {

  var self = this;
  
  // Check to see if we have already loaded this directory
  if ( self.cacheTemplates && self.loadedDirs[dir] ) {
    return callback();
  }
  
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


  walker.on('end', function() {
    self.loadedDirs[dir] = true;
    callback();
  });

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


Template.prototype.asAMD = function () {

  var out = "";
  out += "define(                                                       \n";
  out += "  ['underscore'],                                             \n";
  out += "  function(_) {                                               \n";
  out += "    'use strict';                                             \n";
  out += "                                                              \n";
  out += "    var AMD = function () {};                                 \n";
  out += "                                                              \n";
  out += "    AMD.render = <%= render.toString()  %>;                   \n";
  out += "                                                              \n";
  out += "    AMD.templates = {};                                       \n";
  out += "    <% _.each( templates, function (template, key) { %>       \n";
  out += "      AMD.templates[<%= key %>] = <%= template.source %>;     \n";
  out += "    <% }); %>                                                 \n";
  out += "    };                                                        \n";
  out += "  }                                                           \n";
  out += ");                                                            \n";
  
  out = out.replace(/\s+\n/gm, "\n");
  
  var amd = _.template(out, this);

  return amd;
};



Template.prototype.forExpress = function() {
  var self = this;
  return function (path, options, callback ) {

    // The .render method in express wants to check that the template file
    // exists before passing the path to the engine. To keep things simple for now
    // play along with this, but strip the 'views' dir off the path so that e have a
    // directory and a filename for ease of use later.
    var viewsDir     = options.settings.views;
    var templateName = path.replace( new RegExp('^'+viewsDir+'/?'), '');

    self.loadFromDir(viewsDir, function(err) {      

        if (err) return callback(err);

        // Render the content. If it blows up catche the error and pass it back.
        try {
          return callback(null, self.render(templateName, options) );
        } catch (e) {
          return callback(e);
        }
    });

  };
};


module.exports = Template;
