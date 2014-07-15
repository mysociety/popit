"use strict"; 

var express                 = require('../express-inherit'),
    popit                   = require('../popit'),
    Account                 = require('../schemas/account'),
    Permissions             = require('../schemas/permissions');

module.exports = function() {
  var app = express();

  app.get('/', function (req,res) {
    var permissions = req.popit.permissions();

    permissions.find( { instance: req.popit.instance_id() } ).populate('account', 'username').exec( function(err, instance_permissions ) {
      res.locals.instance_permissions = [];
      if ( err ) {
        return;
      }
      res.locals.instance_permissions = instance_permissions;
      res.render('admin.html');
    });
  });


  app.post(
    '/',
    function (req, res, next ) {
      res.render('admin.html');
    }
  );

  return app;
};
