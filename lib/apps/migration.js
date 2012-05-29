var express       = require('express'),
    Error404      = require('../errors').Error404,
    path          = require('path'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs'),
    requireUser   = require('../middleware/route').requireUser,
    _             = require('underscore'),
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

    saveMigration= function(req, file, parsedData, callback) {
      var migration = new (req.popit.model('Migration'))({
        source: {
          name: file.name,
          mime_type: file.type,
          parsed: parsedData
        }
      });

      migration.save(function(){
        callback(req, migration);
      });
    }

    parseCsv = function(req, file, callback) {
      var parsedData = {};

      csv()
        .fromPath(file.path)
        .on('data',function(data,index){
          parsedData[index] = data;
          //log('#'+index+' '+JSON.stringify(data));
        })
      .on('end',function(count){
        //log(parsedData);
        log('Number of lines: '+count);

        callback(req, parsedData, file);

      })
      .on('error',function(error){
        console.log(error.message);
      });
    }

    upload_post = function (req, res, next) {
      log(req.files);

      var file = req.files.source;

      parseCsv(req, file, function(req, parsedData, file) {
        saveMigration(req, parsedData, file, function(req, migration) {
          req.session.migrationFile = migration.id;
          res.redirect('/migration/' + migration.id);
        });
      });
    }

    upload_get = function (req,res) {
      res.render('migration');
    }

    app.post('/upload', upload_post );
    app.get('/upload', upload_get );

    app.get('/:id', function (req, res, next, id) {
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
