var express       = require('express'),
    Error404      = require('../errors').Error404,
    path          = require('path'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs'),
    requireUser   = require('../middleware/route').requireUser,
    _             = require('underscore'),
    csv           = require('csv');

var log           = console.log;

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

module.exports = function () {

  var app = express.createServer();
  
  /*
   * Parses a csv fom path and calls the callback with the parsed data.
   */
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

  /*
   * Converts mapping+attributes into easily accessible dict.
   * take a look at the tests for an example.
   */
  app.invert = function(mappings, attributes) {
    var inverted = {};
    _.each(_.zip(mappings, attributes), function(item) {
      if (!inverted[item[0][1]]) {
        inverted[item[0][1]] = {};
      }
      inverted[item[0][1]][item[0][2]] = item[1];
    });

    return inverted;
  }

  /*
   * Writes the data from a form into the database according to the provided mapping. 
   */
  app.doImport = function(popit, schema, mappings, data, cb) {
    log('schema:', schema);
    log('mappings:', mappings);
    log('popit:', popit);
    log('data:', data);

    var PersonModel = popit.model('Person');
    var person, people = [], count = 0;
    var useable;

    _.each(data, function(attributes) {
      useable = app.invert(mappings, attributes);

      log(useable);

      useable.name = useable.name['First name']+'  '+useable.name['Last name'];
      useable.slug = useable.name;
      person = new PersonModel(useable);

      people.push(person);
    });

    _.find(people, function (item) {
      return item.save(function (err) {
        if (err) {
          log(err);
          cb(err,[]);
          return true; // break outer loop
        } else {
          count++;
          if (count === people.length) {
            cb(null, people);
          }
          // no error, no break
          return false;
        }
      });
    });
  }

  app.mounted(function(parent) {

    var app = this;

    /*
     * Shows the migration page
     */
    app.get('/', requireUser, function (req,res) {
      if( ! res.local('error') ) res.local('error', '');

      var query = req.popit.model('Migration').find().asc('created');

      query.run(function(err, docs) {
        if (err) throw err;

        res.local('migration', docs);
        res.render('migration');
      });
    });

    /*
     * Deletes all migrations from the database. 
     * This does not mean the imported data is lost, it just 
     * means that the migration object is deleted. 
     */
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

    /*
     * Creates a new migration object
     */
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
        }
      });

      migration.save(function(err, obj) {
        callback(obj);
      });
    }

    /*
     * Provide access to app functions;
     */
    parseCsv = app.parseCsv;
    doImport = app.doImport;

    /*
     * Handle upload and parse provided csv
     */
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

    /*
     * Show mapping page for a migration
     */
    mappingGet = function (req, res, next, id) {
      req.popit.model('Migration').findOne({id: id}, function(err, doc) {
        if (err) console.log( err );
        if (!doc) {
          next( new Error404() );
        } else {
          res.local('migration', doc);
          res.local('schemas', schemas);
          res.local('_', _);
          res.render('migration/mapping');
        }
      });
    }
    
    /*
     * Handle the import request. 
     * This happens after the CSV parsing and the definition of the mapping.
     */
    mappingPost = function (req, res, next, id) {
      req.popit.model('Migration').findOne({id: id}, function(err, doc) {
        if (err) console.log( err );
        if (!doc) {
          next( new Error404() );
        } else {
          var formData = req.body;
          var mappings = _.zip(formData["csv-attribute"], formData["db-attribute-class"], formData["db-attribute"])
          
          var schema = formData["db-schema"];

          doImport(req.popit, schema, mappings, doc.source.parsed.data, function(err, people) {
            // TODO nicer redirect
            res.redirect('/migration');
          });
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
