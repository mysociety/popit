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
  res.render('admin.html');
});
