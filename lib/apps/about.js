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
 
  app.mounted(function(parent){
  
    var app = this;

    app.get('/', function (req,res) {
        load_about_settings(req, fields, function(fields){
          res.local('fields', fields);
          res.render('about/index');
        });
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

    function load_about_settings(req, fields, cb){
      req.popit.load_settings( function (err) {
        
        if (err) throw err;
        var field_names = Object.keys(fields);
        
        for(var i in field_names)
        {
          fields[field_names[i]].value = req.popit.setting(field_names[i]);
        }
        cb(fields);
      });
    }
  });
  return app;
};