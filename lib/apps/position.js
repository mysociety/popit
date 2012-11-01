"use strict"; 

var express       = require('express'),
    winston       = require('winston'),
    Error404      = require('../errors').Error404,
    path          = require('path'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs'),
    requireUser   = require('../middleware/route').requireUser,
    image         = require('./image'),
    utils         = require('../utils');


module.exports = function () {

  var app = express();
  
  app.helpers({
    image_proxy: utils.image_proxy_helper
  });


  app.get('/', function (req,res) {
    res.send('FIXME - implement list page');
  });    
  
  app.param('positionID', function (req, res, next, id) {
    req.popit
      .model('Position')
      .findById(id)
      .populate('person')
      .populate('organisation')
      .exec(function(err, doc) {
        if (err) winston.error( err );
        if (!doc) {
          next( new Error404() );
        } else {
          res.local('position', doc);
          req.object = doc;
          next();
        }
      });
  });
  
  app.get('/:positionID', function(req,res) {
    res.render('position/view');
  });
    
  return app;
};
