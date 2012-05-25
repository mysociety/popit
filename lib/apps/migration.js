var express       = require('express'),
    Error404      = require('../errors').Error404,
    path          = require('path'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs'),
    requireUser   = require('../middleware/route').requireUser,
    _             = require('underscore');


module.exports = function () {

  var app = express.createServer();


  app.mounted(function(parent){

    var app = this;

    app.get('/', function (req,res) {
      res.render('migration');
    });

  });

  return app;
};
