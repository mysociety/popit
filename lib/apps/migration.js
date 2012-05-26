var express       = require('express'),
    Error404      = require('../errors').Error404,
    path          = require('path'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs'),
    requireUser   = require('../middleware/route').requireUser,
    _             = require('underscore'),
    util          = require('util'),
    csv           = require('csv');

var log           = console.log;


module.exports = function () {

  var app = express.createServer();


  app.mounted(function(parent){

    var app = this;

    app.get('/', function (req,res) {
      var query = req.popit.model('Migration').find().asc('created');
      
      query.run(function(err, docs) {
        if (err) throw err;
        
        res.local('migration', docs);
        res.render('migration');
      });
    });

    upload_post = function (req, res, next) {
      log(req.files);

      var file = req.files.source,
          parsedData = {};

      csv()
        .fromPath(file.path)
        .on('data',function(data,index){
          file[index] = data;
          //log('#'+index+' '+JSON.stringify(data));
        })
        .on('end',function(count){
          log(parsedData);
          log('Number of lines: '+count);
          
          var migration = new (req.popit.model('Migration'))({
            source: {
              mime_type: file.type,
              name: file.name,
              parsed: parsedData
            }
          });

          migration.save(function(){
            req.session.migrationFile = migration.id;
            res.redirect('/migration/mapping/' + migration.id);
          });
        })
        .on('error',function(error){
          console.log(error.message);
        });
    }

    upload_get = function (req,res) {
      res.render('migration');
    }
 
    app.post('/upload', upload_post );
    app.get('/upload', upload_get );

    app.get('/mapping/:id', function (req, res, next, id) {
      req.popit.model('Migration').findOne({id: id}, function(err, doc) {
        if (err) console.log( err );
        if (!doc) {
          next( new Error404() );
        } else {
          res.local('migration', doc);
          res.render('migration/mapping');
        }
      });
    });

  });

  return app;
};
