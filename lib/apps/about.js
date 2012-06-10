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
        var settings = req.popit._get_cached_settings();

        res.local('settings', settings);
        res.render('about/edit');
      });

    });

    app.post('/edit', requireUser, function(req, res) {
      req.popit.load_settings( function (err) {
        for(var i in about_keys)
        {
//          console.log(about_keys[i] + " " + req.body[about_keys[i]]);
          req.popit.set_setting( about_keys[i], req.body[about_keys[i]], function (err) {
            if (err) throw err;
          });
        }        
      });
      res.redirect('/about/edit');
    });
  });

  return app;
};