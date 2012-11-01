"use strict"; 

var express       = require('express'),
    Error404      = require('../errors').Error404,
    requireUser   = require('../middleware/route').requireUser,
    _             = require('underscore'),
    async         = require('async');


module.exports = function () {

  var app = express();

  var fields = {
    "name":          {"type": "textbox",  "label": "Name"          },
    "description":   {"type": "textarea", "label": "Description"   },
    "region":        {"type": "textbox",  "label": "Region"        },
    "purpose":       {"type": "textbox",  "label": "Purpose"       },
    "contact_name":  {"type": "textbox",  "label": "Contact Name"  },
    "contact_email": {"type": "textbox",  "label": "Contact Email" },
    "contact_phone": {"type": "textbox",  "label": "Contact Phone" },
  };
  
  // add in the keys to the data so that they can be used for things like css
  // class names.
  _.each( _.keys(fields), function (key) { fields[key].key = key; });

  var load_about_settings = function (req){
      var field_names = Object.keys(fields);

      for(var i in field_names)
      {
        fields[field_names[i]].value = req.popit.setting(field_names[i]);
      }
      return fields;
  };

  var load_about_data = function (req, cb){
      var field_names = Object.keys(fields);
      var result = {};

      result.name = req.popit.instance_name();

      for(var i in field_names)
      {
        result[field_names[i]] = req.popit.setting(field_names[i]);
      }

      req.popit.model('Person').count({}, function(err, count){

        if(err) throw err;
        result.person_count = count;

        req.popit.model('Organisation').count({}, function(err, count){
          if(err) throw err;
          result.organisation_count = count;
          cb(result);
        });
      });
  };

  app.get('/', function (req,res) {
    fields = load_about_settings(req);
    res.locals.fields = fields;
    res.render('about/index');
  });
  
  app.get('/edit', requireUser, function (req,res) {
    fields = load_about_settings(req);
    res.locals.fields = fields;
    res.render('about/edit');
  });
  
  app.post('/edit', requireUser, function(req, res, next) {
  
    var field_names = Object.keys(fields);
  
    async.forEach(
      field_names,
      function (name, cb) {
        req.popit.set_setting( name, req.param(name), cb );          
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