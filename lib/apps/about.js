"use strict"; 

var express       = require('../express-inherit'),
    Error404      = require('../errors').Error404,
    _             = require('underscore'),
    async         = require('async'),
    user          = require('../authorization');


module.exports = function () {

  var app = express();

  var fields = {
    "name":               { type: "textbox",  label: "Name"                            },
    "description":        { type: "textarea", label: "Description"                     },
    "region":             { type: "textbox",  label: "Region"                          },
    "purpose":            { type: "textbox",  label: "Purpose"                         },
    "contact_name":       { type: "textbox",  label: "Contact Name"                    },
    "contact_email":      { type: "textbox",  label: "Contact Email"                   },
    "contact_phone":      { type: "textbox",  label: "Contact Phone"                   },
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
    
    async.forEach(
      field_names,
      function (name, cb) {

        // If value not supplied use false. This allows us to accept the checkbox input.
        var value = req.param(name) || false;
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
