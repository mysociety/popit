"use strict"; 

var express       = require('../express-inherit'),
    Error404      = require('../errors').Error404,
    _             = require('underscore'),
    async         = require('async'),
    tags          = require('language-tags'),
    user          = require('../authorization');


module.exports = function () {

  var app = express();

  var fields = {
    "name":               { type: "textbox",  label: "Name"                            },
    "description":        { type: "textarea", label: "Description"                     },
    "language":           { type: "textbox",  label: "Language code", placeholder: 'e.g. zh-Hant or en-US' },
    "alt_languages":      { type: "textbox",  label: "Alternative Language code", placeholder: 'e.g. zh-Hant or en-US' },
    "region":             { type: "textbox",  label: "Region"                          },
    "purpose":            { type: "textbox",  label: "Purpose"                         },
    "contact_name":       { type: "textbox",  label: "Contact Name"                    },
    "contact_email":      { type: "textbox",  label: "Contact Email"                   },
    "contact_phone":      { type: "textbox",  label: "Contact Phone"                   },
    "disclaimer":         { type: "textarea", label: "Override disclaimer"             },
    "no-spider":          { type: "checkbox", label: "Do Not Spider"                   },
    "license":            { type: "textarea", label: "License text"                    },
  };
  
  // create an array of the field names
  var field_names = _.keys(fields);

  // add in the keys to the data so that they can be used for things like css
  // class names.
  _.each( field_names, function (key) { fields[key].key = key; });

  var load_about_settings = function (req){
      for(var i in field_names)
      {
        fields[field_names[i]].value = req.popit.setting(field_names[i]);
      }
      return fields;
  };

  var load_about_data = function (req, cb){
      var result = {};

      result.name = req.popit.instance_name();

      for(var i in field_names)
      {
        result[field_names[i]] = req.popit.setting(field_names[i]);
      }

      req.popit.model('Person').count({}, function(err, count){

        if(err) throw err;
        result.person_count = count;

        req.popit.model('Organization').count({}, function(err, count){
          if(err) throw err;
          result.organization_count = count;
          cb(result);
        });
      });
  };

  app.get('/', function (req,res) {
    fields = load_about_settings(req);
    res.locals.fields = fields;
    res.render('about/index.html');
  });
  
  app.get('/edit', user.can('edit instance'), function (req,res) {
    fields = load_about_settings(req);
    res.locals.fields = fields;
    res.render('about/edit.html');
  });
  
  app.post('/edit', user.can('edit instance'), function(req, res, next) {

    var invalid = 0;
    if ( req.param('language') && !tags.check(req.param('language')) ) {
      invalid = 1;
      req.flash('info', 'Default language ' + req.param('language') + ' is not a recognized language.');
    }

    if ( req.param('alt_languages') && !tags.check(req.param('alt_languages')) ) {
      invalid = 1;
      req.flash('info', 'Alternative language ' + req.param('alt_languages') + ' is not a recognized language.');
    }

    if ( invalid ) {
      for(var i in field_names) {
        fields[field_names[i]].value = req.param(field_names[i]);
      }
      res.locals.fields = fields;
      return res.render('about/edit.html');
    }

    async.forEach(
      field_names,
      function (name, cb) {

        // If value not supplied use false. This allows us to accept the checkbox input.
        var value = req.param(name) || false;

        // at some point we will want to provide multiple alternative languages but
        // for now only one, however save in an array for future proofing.
        if ( name == 'alt_languages' && value ) {
          value = [ req.param(name) ];
        }

        req.popit.set_setting( name, value, cb );          
      },
      function (err) {
        if (err) return next(err);
        res.redirect('/about');          
      }
    );
  });

  app.load_about_settings = load_about_settings;
  app.load_about_data = load_about_data;

  return app;
};
