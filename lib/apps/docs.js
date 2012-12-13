"use strict"; 

var express       = require('../express-inherit'),
    config        = require('config'),
    winston       = require('winston'),
    markx         = require('markx'),
    yaml          = require('js-yaml'),
    fs            = require('fs'),
    Error404      = require('../errors').Error404;

module.exports = function () {
  var app = express();

  app.get('*', function(req, res, next){
  
    var filename = req.path.replace(/\/$/,'') || 'index';
    var markdown_file = config.docs_dir + '/' + filename + '.md';
  
    fs.exists(markdown_file, function (exists) {
      if (!exists) {
        return next(new Error404());
      }

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
