"use strict"; 

var express       = require('../express-inherit'),
    winston       = require('winston'),
    Error404      = require('../errors').Error404,
    path          = require('path'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs'),
    requireUser   = require('../apps/auth').requireUser,
    _             = require('underscore'),
    async         = require('async'),
    csv           = require('csv'),
    Iconv         = require('iconv').Iconv;

module.exports = function () {

  var app = express();

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
          title: 'Position',
          suggestions: []
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
    Read contents from file, convert and parse
  */
  app.parseCsv = function(path, callback) {
    app.readFileAndConvertToUTF8( path, function (err, string) {
      if(err) throw err;
      app.parseCsvFromString(string, callback);        
    });
  };

  /*
    Read the CSV from a file as a string and pass it to the callback  
  */
  
  app.readFileAndConvertToUTF8 = function (path, callback) {
    
    var iconv_utf8_to_utf8    = new Iconv('UTF-8',        'UTF-8');
    var iconv_win1252_to_utf8 = new Iconv('WINDOWS-1252', 'UTF-8');

    var string = fs.readFile(path, function(err, data) {
      if (err) throw err;
      
      var utf8_data = null;

      // This is a bit hacky - try to convert from utf8 to utf8. This will either pass
      // through unchanged, or choke on an illegal character sequence. If it is a bad
      // sequence then it is almost certainly a CSV produced by Excel in win1252
      // encoding so recode from that. It would be nice to inspect the string and
      // guess the encoding but that is highly unreliable :(
      try {
        utf8_data = iconv_utf8_to_utf8.convert(data).toString();
      } catch (x) {
        utf8_data = iconv_win1252_to_utf8.convert(data).toString();
      }
      
      return callback(err, utf8_data);
    });


  }; 
  
  
  /*
   * Parses a csv from path and calls the callback with the parsed data.
   */
  app.parseCsvFromString = function(string, callback) {
    var parsedData = {};

    csv()
      .from(string)
      .on('record',function(data, index){
        parsedData[index] = data;
        //winston.verbose('#'+index+' '+JSON.stringify(data));
      })
    .on('end',function(count){
      //winston.verbose('Number of lines: '+count);
      callback(null, parsedData);
    })
    .on('error',function(err){
      winston.error(err.message);
      callback(err, parsedData);
    });
  };

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
  };
    
  /*
   * Writes the data from a form into the database according to the provided mapping.
   */
  app.doImport = function(popit, schema, mappings, data, updateCb, functionCallback) {
    /*
    winston.verbose('schema:', schema);
    winston.verbose('mappings:', mappings);
    winston.verbose('popit:', popit);
    winston.verbose('data:', data);
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

      if (useable.name.Title) {
        name += useable.name.Title+' ';
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
      if (name === '') {
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
      
      if (useable.name.Birthdate)
        person.set('birthDate', useable.name.Birthdate);

      async.parallel([
        function(callback) {
          _.each(useable.summary, function(value, key) {
            if (value) {
              person.set('summary', value);
            }
          });
          callback();
        },
        function(callback) {
          _.each(useable.contact, function(value, key) {
            if (value) {
              var cd = new ContactDetail({kind: key, value: value});
              person.contact_details.push(cd);
            }
          });
          callback();
        },
        function(callback) {
          _.each(useable.links, function(value, key) {
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
          var s = person.data;
          _.each(useable.data, function(value, key) {
            if (value) {
              if (s[key]) {
                s[key].push(value);
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
          var ids = person.get("ids") || {};
          _.each(useable.id, function(value, key) {
            var i = {provider: key, id: value};
            ids.push(i);
            });
          person.set('ids', ids);
          callback();
        },
        function(callback) {
          if (useable.position) {
            async.forEach(Object.keys(useable.position), function(key, cb) {
              var value = useable.position[key];
              if (value) {
                Organisation.findOne({name: value}, function(err, doc) {
                  if (err) winston.error( err );
                  else {
                    // find organisation in array to avoid problems when saving
                    doc = doc || _.find(organisations, function(e) {return e.name == value;});
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
          winston.verbose('useable:', useable);
          winston.verbose('positions:', positions);
          winston.verbose('organisation:', organisations);
          winston.verbose('person:', person);
          //*/

          people.push(person);

          forEachCallback(err); //forEach callback
        }); // end of parallel

    }, function(err) {
      if (err) {
        functionCallback(err); 
      }

      //winston.verbose(people)

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
  };


  /*
   * Shows the migration/ index page
   */
  var showMigrationPage = function(req, res) {
    var query = req.popit.model('Migration').find().sort('created');
  
    query.exec(function(err, docs) {
      if (err) throw err;
  
      res.locals.migration = docs;
      res.render('migration/index.html');
    });
  };
  
  /*
   * Shows the status page while the migration is running
   */ 
  var showStatusPage = function(req, res) {
    res.render('migration/status.html');
  };
  
  /*
   * Show mapping page for a migration
   */
  var showMappingPage = function(req, res, next) {
    req.popit.model('Migration').findOne({_id: req.params.id}, function(err, doc) {
      //winston.verbose(doc, req.params.id);
      if (err) winston.error( err );
      if (!doc) {
        next( new Error404() );
      } else {
        res.locals.migration = doc;
        res.locals.schemas = app.schemas;
        res.locals._ = _;
        res.render('migration/mapping.html');
      }
    });
  };
  
  /*
   * Shows the migration/ index page
   */
  app.get('/', requireUser, function (req,res) {
    if( ! res.locals.error ) res.locals.error = '';
  
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
  };
  
  /*
   * Handle upload and parse provided csv
   */
  var uploadPost = function(req, res, next) {
    //winston.verbose(req.files);
  
    if ( !req.files || req.files.source.size === 0) {
      winston.error("no file found");
      res.locals.error = 'required';
      res.redirect('/migration');
      return;
    }
  
    var file = req.files.source;
  
    app.parseCsv(file.path, function(err, parsedData) {
      // TODO handle error
      saveMigration(req, file, parsedData, function(migration) {
        req.session.migrationFile = migration.id;
        res.redirect('/migration/mapping/' + migration.id);
      });
    });        
  };
  
  var uploadGet = function(req,res) {
    res.redirect('/migration');
  };
  
  /*
   * Handle the import request. 
   * This happens after the CSV parsing and the definition of the mapping.
   */
  var mappingPost = function (req, res, next) {
    req.popit.model('Migration').findOne({_id: req.params.id}, function(err, doc) {
      if (err) winston.error( err );
      if (!doc) {
        next( new Error404() );
      } else {
        var formData = req.body;
                  
        var toArray = function (val) {
          return _.isArray(val) ? val : [val];
        };
        
        var csv_attribute      = toArray( formData["csv-attribute"]      );
        var db_attribute_class = toArray( formData["db-attribute-class"] );
        var db_attribute       = toArray( formData["db-attribute"]       );
        
        var mappings = _.zip(csv_attribute, db_attribute_class, db_attribute);
        
        var schema = formData["db-schema"];
  
        app.doImport(req.popit, schema, mappings, doc.source.parsed.data, 
          function(progress, total) {
          // update
          //winston.verbose('saved ', progress + ' of ' +  total);
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
          }
          doc.save();
  
          res.locals.error = err;
          res.locals.people = people;
        });
  
        res.redirect('/migration/status/'+req.params.id);
      }
    });
  };
  
  
  var statusGet = function(req, res, next) {
    req.popit.model('Migration').findOne({_id: req.params.id}, function(err, doc) {
      if (err) winston.error( err );
      if (!doc) {
        next( new Error404() );
      } else {
        showStatusPage(req, res);
      }
    });
  };
  
  app.get('/progress/:id', requireUser, function (req, res, next) {
    req.popit.model('Migration').findOne({_id: req.params.id}, function(err, doc) {
      if (err) winston.error( err );
      if (!doc) {
        next( new Error404() );
      } else {
        
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write( JSON.stringify( doc.tracking ) );
        res.end();
      }
    });
  });
  
  app.get('/status/:id', requireUser, statusGet);
  
  app.post('/upload', requireUser, uploadPost);
  app.get('/upload', requireUser, uploadGet);
  
  app.post('/mapping/:id', mappingPost);
  app.get('/mapping/:id', showMappingPage);

  return app;
};
