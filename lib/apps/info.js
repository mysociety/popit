var express       = require('express'),
    path          = require('path'),
    Error404      = require('../errors').Error404;

var info_app = express.createServer();

info_app.mounted(function(parent){

  this.get('/:page', function(req, res, next){
  
    var template_file = req.app.set('views') + '/info/' + req.param('page') + '.jade';
  
    path.exists(template_file, function (exists) {
      if (exists) {
        res.render( 'info/' + req.param('page') );
      } else {
        next(new Error404());
      }
    });
  
  });   

});

module.exports = info_app;

