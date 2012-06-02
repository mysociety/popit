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
  
  app.parseCsv = function(path, callback) {
      var parsedData = {};

      csv()
        .fromPath(path)
        .on('data',function(data, index){
          parsedData[index] = data;
          //log('#'+index+' '+JSON.stringify(data));
        })
      .on('end',function(count){
        //log('Number of lines: '+count);
        callback(parsedData, null);
      })
      .on('error',function(err){
        console.log(err.message);
        callback(parsedData, err);
      });
  }

  app.mounted(function(parent) {

    var app = this;

    app.get('/', requireUser, function (req,res) {
      if( ! res.local('error') ) res.local('error', '');

      var query = req.popit.model('Migration').find().asc('created');

      query.run(function(err, docs) {
        if (err) throw err;

        res.local('migration', docs);
        res.render('migration');
      });
    });

    app.get('/clear', requireUser, function (req,res) {
      var query = req.popit.model('Migration').find();

      query.run(function(err, docs) {
        if (err) throw err;

        docs.forEach( function (doc) {
          doc.remove(function(err) {
            if (err) throw err;
          });
        });

        res.redirect('/migration');
      });
    });

    saveMigration = function(req, file, parsedData, callback) {
      var migration, header, data;

      header = parsedData[0];
      delete parsedData[0];
      data = parsedData;

      migration = new (req.popit.model('Migration'))({
        source: {
          name: file.name,
          mime_type: file.type,
          parsed: {
            header: header,
            data: data
          }
        },
        mapping: {
          schema: null,
          mappings: null
        }
      });

      migration.save(function() {
        callback(migration);
      });
    }

    parseCsv = app.parseCsv;

    uploadPost = function(req, res, next) {
      log(req.files);

      if ( !req.files || req.files.source.size == 0) {
        log("no file found");
        res.local( 'error', 'required');
        res.redirect('/migration');
        return;
      }

      var file = req.files.source;

      parseCsv(file.path, function(parsedData, err) {
        // TODO handle error
        saveMigration(req, file, parsedData, function(migration) {
          req.session.migrationFile = migration.id;
          res.redirect('/migration/mapping/' + migration.id);
        });
      });
    }

    uploadGet = function(req,res) {
      res.redirect('/migration');
    }

    mappingGet = function (req, res, next, id) {
      req.popit.model('Migration').findOne({id: id}, function(err, doc) {
        if (err) console.log( err );
        if (!doc) {
          next( new Error404() );
        } else {
          var schemas = [{
            name: 'Person',
            id: 'person',
            options: [{
                id: 'name',
                title: 'Name, birthday & similar',
                generic: false,
                suggestions: ['Title', 'First Name', 'Last Name', 'Middle Name', 'Birthday', 'Nickname']
              },{
                id: 'organization',
                title: 'Organization'
              },{
                id: 'contact',
                title: 'Contact Information'
              },{
                id: 'link',
                title: 'Link',
                generic: true,
                suggestions: ['Youtube', 'Twitter']
              },{
                id: 'id',
                title: 'ID'
              },{
                id: 'other',
                title: 'Other'
              }]
            },
            {
              name: 'Organization',
              id: 'organization',
              options: [{
                title: 'Name'
              }]
            }
          ]

          res.local('migration', doc);
          res.local('schemas', schemas);
          res.local('_', _);
          res.render('migration/mapping');
        }
      });
    }

    mappingPost = function (req, res, next, id) {
      req.popit.model('Migration').findOne({id: id}, function(err, doc) {
        if (err) console.log( err );
        if (!doc) {
          next( new Error404() );
        } else {
          var formData = req.body;
          var mappings = _.zip(formData["csv-attribute"], formData["db-attribute-class"], formData["db-attribute"])
          
          var schema = formData["db-schema"];

          log(schema);
          log(mappings);

        }
      });
    }

    app.post('/upload', requireUser, uploadPost);
    app.get('/upload', requireUser, uploadGet);

    app.post('/mapping/:id', mappingPost);
    app.get('/mapping/:id', mappingGet);
  });

  return app;
};
