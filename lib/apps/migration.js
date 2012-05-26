var express       = require('express'),
    Error404      = require('../errors').Error404,
    path          = require('path'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs'),
    requireUser   = require('../middleware/route').requireUser,
    _             = require('underscore'),
    util          = require('util'),
    formidable    = require('formidable');

var dir           =  '/tmp/',
    log           = console.log;


module.exports = function () {

  var app = express.createServer();


  app.mounted(function(parent){

    var app = this;

    app.get('/', function (req,res) {
      res.render('migration');
    });

    upload_post = function (req, res, next) {
      log(req.files);
      log(util.inspect(req.files));

      var file = req.files.source;

      fs.readFile(file.path, file._writeStream.encoding, function(err, data) {
        if (err) {
          console.error(err);
        } else {
          req.session.migrationFile = file.path
          res.redirect('/migration/mapping');
        }
      });
    }

    upload_get = function (req,res) {
      res.render('migration');
    }
 
    app.post('/upload', upload_post );
    app.get('/upload', upload_get );

    app.get('/mapping', function (req,res) {
      res.render('migration/mapping');
    });

  });

  return app;
};
