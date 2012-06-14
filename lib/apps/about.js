var express       = require('express'),
    Error404      = require('../errors').Error404,
    requireUser   = require('../middleware/route').requireUser,
    _             = require('underscore');


module.exports = function () {

  var app = express.createServer();
  
  var fields = {"description":{"type": "textarea", "label": "Description"},
                "region":{"type": "textbox", "label": "Region"},
                "purpose":{"type": "textbox", "label": "Purpose"},
                "contact_name":{"type": "textbox", "label": "Contact Name"},
                "contact_email":{"type": "textbox", "label": "Contact Email"},
                "contact_phone":{"type": "textbox", "label": "Contact Phone"}}

  var load_about_settings = function (req){
      var field_names = Object.keys(fields);

      for(var i in field_names)
      {
        fields[field_names[i]].value = req.popit.setting(field_names[i]);
      }
      return fields;
  }

  var load_about_data = function (req){
      var field_names = Object.keys(fields);
      var result = {};
      for(var i in field_names)
      {
        result[field_names[i]] = req.popit.setting(field_names[i]);
      }
      return result;
  }

  app.mounted(function(parent){
  
    var app = this;

    app.get('/', function (req,res) {
      fields = load_about_settings(req);
      res.local('fields', fields);
      res.render('about/index');
    });

    app.get('/edit', function (req,res) {
      fields = load_about_settings(req);
      res.local('fields', fields);
      res.render('about/edit');
    });

    app.post('/edit', requireUser, function(req, res) {
      req.popit.load_settings( function (err) {
        var field_names = Object.keys(fields);
        for(var i in field_names)
        {
          req.popit.set_setting( field_names[i], req.body[field_names[i]], function (err) {
            if (err) throw err;
          });
        }
      });
      res.redirect('/about/edit');
    });    
  });

  app.load_about_settings = load_about_settings;
  app.load_about_data = load_about_data;

  return app;
};