var express       = require('express'),
    Error404      = require('../errors').Error404,
    path          = require('path'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs'),
    requireUser   = require('../middleware/route').requireUser,
    _             = require('underscore'),
    async         = require('async'),
    csv           = require('csv');

var log           = console.log;

module.exports = function () {

  var app = express.createServer();

  app.schemas = {'person': {
      name: 'Person',
      model: 'Person',
      options: {
        name: {
          title: 'Name, birthday & similar',
          strict: true,
          suggestions: ['Full name', 'Title', 'First name', 'Last name', 'Middle name', 'Birthday', 'Nickname']
        },
        summary: {
          title: 'Summary',
          strict: true,
          suggestions: ['Summary']
        },
        position: {
          title: 'Position'
        },
        contact: {
          title: 'Contact Information',
          strict: false,
          suggestions: ['Address', 'Phone', 'Fax', 'Email', 'Skype']
        },
        links: {
          title: 'Link',
          strict: false,
          suggestions: ['Website', 'Wikipedia', 'Youtube', 'Twitter', 'Freebase' ,'RSS']
        },
        id: {
          title: 'ID',
          strict: false,
          suggestions: ['Facebook', 'Twitter']
        },
        data: {
          title: 'Other data',
          strict: false,
          suggestions: ['University', 'School', 'Gender']
        }
      }
  }};
  
  /*
   * Parses a csv from path and calls the callback with the parsed data.
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
   * Take a look at the tests for an example.
   */
  app.zipIt = function(mappings, attributes) {
    var inverted = {};
    _.each(_.zip(mappings, attributes), function(item) {
      if (!item[0][0] || !item[0][1] || !item[0][2]) {
        return;
      }
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
  app.doImport = function(popit, schema, mappings, data, updateCb, functionCallback) {
    /*
    log('schema:', schema);
    log('mappings:', mappings);
    log('popit:', popit);
    log('data:', data);
    //*/

    var Person = popit.model('Person'),
      Link = popit.model('Link'),
      Position = popit.model('Position'),
      Organisation = popit.model('Organisation'),
      ContactDetail = popit.model('ContactDetail'),
      positions = [], people = [], organisations = [];

    // async.forEach does not support objects, data is an object, not an array
    async.forEachSeries(Object.keys(data), function(key, forEachCallback) {
      var person, useable, res = [], attributes, name = '';
    
      attributes = data[key];

      useable = app.zipIt(mappings, attributes);

      if (useable.name['Title']) {
        name += useable.name['Title']+' ';
      }
      
      // either full or first name
      if (useable.name['First name']) {
        name += useable.name['First name'];
      } else {
        name += useable.name['Full name'];
      }
      
      if (useable.name['Middle name']) {
        name += ' '+ useable.name['Middle name'];
      }
      if (useable.name['Last name']) {
        name += ' '+ useable.name['Last name'];
      }

      // sometimes there are multiline entries in csv's
      if (name == '') {
        if (people.length > 0) {
          person = people.pop();
        } else {
          forEachCallback("Cannot pop person for multiline csv.");
          return;
        }
      } else {
        // create new person
        person = new Person({'name': name, 'contact_details' : [], 'data': {}, 'links': []}, false);
        person.set("ids", []);
      }
      
      if (useable.name["Birthdate"])
        person.set('birthDate', useable.name["Birthdate"]);

      async.parallel([
        function(callback) {
          _.each(useable['summary'], function(value, key) {
            if (value) {
              person.set('summary', value);
            }
          });
          callback();
        },
        function(callback) {
          _.each(useable['contact'], function(value, key) {
            if (value) {
              var cd = new ContactDetail({kind: key, value: value});
              person.contact_details.push(cd);
            }
          });
          callback();
        },
        function(callback) {
          _.each(useable['links'], function(value, key) {
            if (value) {
              var l = new Link({comment: key, url: value});
              person.links.push(l); 
            }
          });
          callback();
        },
        function(callback) {
          // simple key value/ key array pairs
          //var s = person.get("data") || {}
          var s = person.data
          _.each(useable['data'], function(value, key) {
            if (value) {
              if (s[key]) {
                s[key].push(value)
              } else {
                s[key] = [value];
              }
            }
          });
          //person.set('data', s);
          callback();
        },
        function(callback) {
          // ids may get a little bit more information in the future
          var ids = person.get("ids") || {}
          _.each(useable['id'], function(value, key) {
            var i = {provider: key, id: value};
            ids.push(i);
            });
          person.set('ids', ids);
          callback();
        },
        function(callback) {
          if (useable['position']) {
            async.forEach(Object.keys(useable['position']), function(key, cb) {
              var value = useable['position'][key];
              if (value) {
                Organisation.findOne({name: value}, function(err, doc) {
                  if (err) console.log( err );
                  else {
                    // find organisation in array to avoid problems when saving
                    doc = doc || _.find(organisations, function(e) {return e.name == value});
                    if (!doc) {
                      doc = new Organisation({name: value});
                      organisations.push(doc);
                    }
                    var pos = new Position({
                      title: key,
                      organisation: doc,
                      person: person,
                    });
                    positions.push(pos);
                  }
                  cb(err);
                }); 
              } else {
                callback();
              }
            }, function(err) {
              callback(err);
            });
          } else {
            callback();
          }
        }],
        function(err, results) {

          /*
          log('useable:', useable);
          log('positions:', positions);
          log('organisation:', organisations);
          log('person:', person);
          //*/

          people.push(person);

          forEachCallback(err); //forEach callback
        }); // end of parallel

    }, function(err) {
      if (err) {
        functionCallback(err); 
      }

      //log(people)

      var toBeSaved = _.union(people, positions, organisations);
      var total = toBeSaved.length;
      var progress = 0;

      // save people and positions to database
      // TODO make parallel, take care of slugs
      async.forEachSeries(toBeSaved, function(item, callback) {
        item.save(function (err) {
          progress++;
          updateCb(progress, total);
          callback(err);
        });
      }, function(err) {
        functionCallback(err, people, positions, organisations);
      });

    }); //end of forEach
  }

  app.mounted(function(parent) {

    var app = this;


    /*
     * Shows the migration/ index page
     */
    var showMigrationPage = function(req, res) {
      var query = req.popit.model('Migration').find().sort('created', 1);

      query.exec(function(err, docs) {
        if (err) throw err;

        res.local('migration', docs);
        res.render('migration');
      });
    }

    /*
     * Shows the status page while the migration is running
     */ 
    var showStatusPage = function(req, res) {
      res.render('migration/status');
    }

    /*
     * Show mapping page for a migration
     */
    var showMappingPage = function(req, res) {
      req.popit.model('Migration').findOne({_id: req.params.id}, function(err, doc) {
        //log(doc, req.params.id);
        if (err) console.log( err );
        if (!doc) {
          next( new Error404() );
        } else {
          res.local('migration', doc);
          res.local('schemas', app.schemas);
          res.local('_', _);
          res.render('migration/mapping');
        }
      });
    }

    /*
     * Shows the migration/ index page
     */
    app.get('/', requireUser, function (req,res) {
      if( ! res.local('error') ) res.local('error', '');

      showMigrationPage(req, res);
    });

    /*
     * Deletes all migrations from the database. 
     * This does not mean the imported data is lost, it just 
     * means that the migration object is deleted. 
     */
    app.get('/clear', requireUser, function (req,res) {
      var query = req.popit.model('Migration').find();

      query.exec(function(err, docs) {
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
    var saveMigration = function(req, file, parsedData, callback) {
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
        tracking: {
          progress: -1,
          total: -1,
          count: -1,
          err: []
        }
      });

      migration.save(function(err, obj) {
        callback(obj);
      });
    }

    /*
     * Handle upload and parse provided csv
     */
    var uploadPost = function(req, res, next) {
      //log(req.files);

      if ( !req.files || req.files.source.size == 0) {
        log("no file found");
        res.local( 'error', 'required');
        res.redirect('/migration');
        return;
      }

      var file = req.files.source;

      app.parseCsv(file.path, function(parsedData, err) {
        // TODO handle error
        saveMigration(req, file, parsedData, function(migration) {
          req.session.migrationFile = migration.id;
          res.redirect('/migration/mapping/' + migration.id);
        });
      });
    }

    var uploadGet = function(req,res) {
      res.redirect('/migration');
    }
    
    /*
     * Handle the import request. 
     * This happens after the CSV parsing and the definition of the mapping.
     */
    var mappingPost = function (req, res, next) {
      req.popit.model('Migration').findOne({_id: req.params.id}, function(err, doc) {
        if (err) console.log( err );
        if (!doc) {
          next( new Error404() );
        } else {
          var formData = req.body;
          var mappings = _.zip(formData["csv-attribute"], formData["db-attribute-class"], formData["db-attribute"])
          
          var schema = formData["db-schema"];

          app.doImport(req.popit, schema, mappings, doc.source.parsed.data, 
            function(progress, total) {
            // update
            //log('saved ', progress + ' of ' +  total);
            doc.tracking.progress = progress;
            doc.tracking.total = total;
            doc.save();
          }, function(err, people) {
            // finished
            doc.tracking.err = err;
            if (people) {
              doc.tracking.count = people.length;
            } else{
              doc.tracking.count = -1;
            };
            doc.save();

            res.local('error', err);
            res.local('people', people);
          });

          res.redirect('/migration/status/'+req.params.id);
        }
      });
    }


    var statusGet = function(req, res, next) {
      req.popit.model('Migration').findOne({_id: req.params.id}, function(err, doc) {
        if (err) console.log( err );
        if (!doc) {
          next( new Error404() );
        } else {
          showStatusPage(req, res);
        }
      });
    }

    app.get('/progress/:id', requireUser, function (req, res, next) {
      req.popit.model('Migration').findOne({_id: req.params.id}, function(err, doc) {
        if (err) console.log( err );
        if (!doc) {
          next( new Error404() );
        } else {
          
          res.writeHead(200, {'Content-Type': 'application/json'});
          p = doc.tracking;
          log(p);

          res.write(JSON.stringify(p));
          res.end();
        }
      });
    });

    app.get('/status/:id', requireUser, statusGet);

    app.post('/upload', requireUser, uploadPost);
    app.get('/upload', requireUser, uploadGet);

    app.post('/mapping/:id', mappingPost);
    app.get('/mapping/:id', showMappingPage);
  });

  return app;
};
