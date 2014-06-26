"use strict";

var config = require('config');
var express = require('../express-inherit');
var mailer = require('../mailer');
var utils = require('../utils');
var PopIt = require('../popit');

var popit = new PopIt();
popit.set_as_master();

var app = module.exports = express();

app.post('/', function(req, res, next) {
  var suffix = config.instance_server.domain_suffix;
  var slug = utils.extract_slug(req.headers.host, suffix);
  popit.model('Instance').findOne({slug: slug}, function(err, instance) {
    if (err) {
      return next(err);
    }
    res.render('emails/suggestion.txt', {
      instance: instance,
      suggestion: req.body.suggestion,
      field: req.body.field,
      url: req.body.url
    }, function(err, message) {
      if (err) {
        return next(err);
      }
      mailer.send(req, {
        to: instance.email,
        subject: '[' + slug + '] Suggested change',
        text: message
      });
      res.send({message: 'Success'});
    });
  });
});
