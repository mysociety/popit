"use strict";

var express = require('../express-inherit');
var popit = require('../popit');
var Account = require('../schemas/account');
var Permissions = require('../schemas/permissions');
var user = require('../authorization');

var app = module.exports = express();

app.get('/', user.can('access admin page'), function(req, res, next) {
  var Permissions = req.popit.permissions();
  Permissions.find({ instance: req.popit.instance_id() }).populate('account').exec(function(err, permissions) {
    if (err) {
      return next(err);
    }
    res.locals.permissions = permissions;
    res.render('admin.html');
  });
});

app.post('/', user.can('access admin page'), function(req, res, next) {
  var Permissions = req.popit.permissions();

  Permissions.findById(req.body.permission_id).populate('account').exec(function(err, permission) {
    if (err) {
      return next(err);
    }
    if (req.body.remove) {
      permission.remove(function(err) {
        if (err) {
          return next(err);
        }
        req.flash('info', 'Access removed for ' + permission.account.name);
        res.redirect('/admin');
      });
      return;
    }
    permission.role = req.body.role;
    permission.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('info', 'Updated ' + permission.account.name);
      res.redirect('/admin');
    });
  });
});
