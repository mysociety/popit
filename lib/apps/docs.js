"use strict"; 

var express       = require('../express-inherit'),
    config        = require('config'),
    winston       = require('winston'),
    markx         = require('markx'),
    yaml          = require('js-yaml'),
    fs            = require('fs'),
    Error404      = require('../errors').Error404;

/*

This is an app that broadly copies the approach that Jekyll takes to templates,
but does it natively in node. The html is generated on demand, let the cache
take care of caching it.

Differences to Jekyll are:

  * trailing slash not needed on paths
  * templating language used for layout file is not liquid, but ejs
  * no output is written to file
  * syntax highlighting is done using highlight.js

*/

module.exports = function () {
  var app = express();

  app.get('*', function(req, res, next){
  
  // Get the path and check that it does not have a trailing slash on it. This
  // is mostly so that we are consistent.
  var original_path = req.path;
  var ideal_path = original_path.replace(/\/+$/,'') || '/';
    if ( ideal_path && original_path != ideal_path ) {
    var rd_to = app.route + ideal_path;
    return res.redirect(rd_to);
  }
  
  // work out what the markdown file should be called.
  var base_name = ideal_path.replace(/\/+$/,'') || '';
  var filename = ( base_name || 'index' ) + '.md';
  var markdown_file = config.docs_dir + '/' + filename;
  
  fs.exists(
    markdown_file,
    function (exists) {
      if (!exists) { return next(new Error404()); }

      // read the file contents
      fs.readFile( markdown_file, 'utf-8', function(err, markdown) {
        if ( err ) return next(err);
        
        // defaults
        var yaml_frontmatter = '';
        var data = { page: {} };
        
        // split into yaml and markdown
        var parts = markdown.split( '---' );
        if (parts.length == 3) {
          // parts[0] is just an empty string.
          yaml_frontmatter = parts[1];
          markdown = parts[2];          
        }
        
        // process the YAML
        if (yaml_frontmatter) {
          data.page = yaml.load(yaml_frontmatter);
        }

        // add in bits needed        
        data.page.url = req.path;

        // render the markdown
        markx({
            input: markdown, //can be either a filepath or a source string
            template: config.docs_dir + '/layout.html', //can either be filepath or source string
            highlight: true, //parse code snippets for syntax highlighters, default: true
            data: data //data that gets passed into template
        }, function(err, html) {
          if ( err ) return next(err);

          // return results
          res.send(html);
          
        });

      });
      
    });
  
  });   
  
  return app;
};
