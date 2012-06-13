var express       = require('express'),
    Error404      = require('../errors').Error404,
    requireUser   = require('../middleware/route').requireUser,
    _             = require('underscore');


module.exports = function () {

  var app = express.createServer();
  
  
  app.mounted(function(parent){
  
    var app = this;
    var about_keys = ['description', 'region','contact_name', 'contact_email', 'contact_phone'];

    app.get('/edit', requireUser, function (req,res) {

      req.popit.load_settings( function (err) {
        var fields = req.popit.get_about_fields();
        var settings = req.popit._get_cached_settings();
        res.local('settings', settings);
        res.local('fields', fields);
        res.render('about/edit');
      });

    });

    app.post('/edit', requireUser, function(req, res) {
      req.popit.load_settings( function (err) {

        var fields = req.popit.get_about_fields();
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

  return app;
};