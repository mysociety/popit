"use strict";

var express = require('../express-inherit');
var config = require('config');
var getLangName = require('../utils').getLangName;

var app = module.exports = express();

app.post('/', function(req, res, next) {
  req.session.language = req.body.lang;
  var redirect_to = req.body.redirect_to || '/';
  req.flash('info', 'Language set to ' + getLangName(req.session.language) + '.');
  res.redirect(redirect_to);
});
