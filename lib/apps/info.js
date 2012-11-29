"use strict"; 

var express       = require('../express-inherit'),
    winston       = require('winston'),
    fs            = require('fs'),
    Error404      = require('../errors').Error404;

module.exports = function () {
  var info_app = express();

  info_app.get('/:page', function(req, res, next){
  
    var template_file = req.app.set('views') + '/info/' + req.param('page') + '.html';
  
    fs.exists(template_file, function (exists) {
      if (exists) {
        res.render( 'info/' + req.param('page') + '.html');
      } else {
        next(new Error404());
      }
    });
  
  });   
  
  return info_app;
};
