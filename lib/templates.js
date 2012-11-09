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

  var self     = this;
  var dirRegEx = new RegExp( '^' + dir + '/?' );
  
  // Check to see if we have already loaded this directory
  if ( self.cacheTemplates && self.loadedDirs[dir] ) {
    return callback();
  }
  
  var walker  = walk.walk( dir );

  var loadTemplate = function(root, stat, next) {
    var filename     = path.join(root, stat.name);
    var template_key = filename.replace(dirRegEx,'');

    fs.readFile(
      filename,
      'utf8',
      function(err, content) {
        if (err) return next(err);

        try {
          self.templates[template_key] = _.template(content);
          next();
        } catch (e) {
          callback(new Error( "Can't compile template '" + filename + "': " + e ));
          next(e);
        }
      }
    );
  };

  walker.on('file',         loadTemplate);
  walker.on('symbolicLink', loadTemplate);

  walker.on('end', function() {
    self.loadedDirs[dir] = true;
    callback();
  });
  
  // walker.on('errors', function (root, errors, next) {
  //   callback(errors);
  //   next(errors);
  // });

};


Template.prototype.render = function ( templateName, data ) {
  var self = this;

  // create a version of this method that is bound to us
  var localRender = function ( localTemplateName, localDataPassed ) {
    var localData = _.extend(
      {},
      data,
      localDataPassed,
      { __parentTemplate: templateName }
    );
    return self.render( localTemplateName, localData );
  };

  // add in the function to the data so that it can be called in the templates
  var augmentedData = _.extend(
    {},
    data,
    {
      render: localRender,
    }
  );

  // check that we have the template requested.
  var tmpl = this.templates[templateName];
  if (!tmpl) {
    var message = "Can't find template: '" + templateName + "'";
    if ( data.__parentTemplate) {
       message += " (rendered in '" + data.__parentTemplate + "')";
     }
    throw new Error(message);
  }

  // run the template and return the results.
  try {
    return tmpl(augmentedData);
  } catch (e) {
    throw new Error( "Error rendering '" + templateName + "': " + e);
  }
};


Template.prototype.asAMD = function () {

  // Note - I'd like to put a 'use strict' in this, but the underscore template
  // code uses 'with' which it does not like.
  
  var out = "";
  out += "define(                                                       \n";
  out += "  ['underscore'],                                             \n";
  out += "  function(_) {                                               \n";
  out += "                                                              \n";
  out += "    var AMD = function () {};                                 \n";
  out += "                                                              \n";
  out += "    AMD.render = <%= render.toString()  %>;                   \n";
  out += "                                                              \n";
  out += "    AMD.templates = {};                                       \n";
  out += "    <% _.each( templates, function (template, key) { %>       \n";
  out += "      AMD.templates['<%= key %>'] = <%= template.source %>;   \n";
  out += "    <% }); %>                                                 \n";
  out += "    return AMD;                                               \n";
  out += "  }                                                           \n";
  out += ");                                                            \n";
  
  out = out.replace(/\s+\n/gm, "\n");
  
  var amd = _.template(out, this);

  return amd;
};


Template.prototype.middlewareAMD = function () {
  var self = this;
  return function ( req, res, next ) {
    
    var views = req.app.get('views');
    
    self.loadFromDir( views, function(err) {      
      res
        .set('Content-Type', 'application/javascript')
        .send( self.asAMD() );
    });
    
  };
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

        // Render the content. If it blows up catch the error and pass it back.
        try {
          var out = self.render(templateName, options);
          return callback(null, out );
        } catch (e) {
          return callback(e);
        }
    });

  };
};


module.exports = Template;
