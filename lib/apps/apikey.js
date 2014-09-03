"use strict";

var express = require('../express-inherit');
var requireUser = require('./auth').requireUser;
var config = require('config');

var app = module.exports = express();

app.get('/apikey', requireUser, function(req, res, next) {
  res.render('apikey.html');
});

app.post('/apikey', requireUser, function(req, res, next) {
  var errors = res.locals.errors = [];
  if ( req.body.delete == 1 ) {
    if ( req.user.apikey ) {
      req.user.removeAPIKey( function() {
        res.render('apikey.html');
      });
    } else {
      res.locals.errors = [ 'You do not have an API key' ];
      res.render('apikey.html');
    }
  } else {
    if ( req.user.apikey ) {
      res.locals.errors = [ 'You already have an API key' ];
      res.render('apikey.html');
    } else {
      req.user.setAPIKey( function() {
        res.render('apikey.html');
      });
    }
  }
});
