"use strict";

var UTA = require('underscore-template-additions');
var engines = require('consolidate');

module.exports = function(app, viewDirectory) {
  var templates = new UTA();

  if (app.get('env') === 'production') {
    templates.cacheTemplates = true;
  }
  app.set('views', viewDirectory);
  app.engine('html', templates.forExpress());
  app.engine('txt', engines.hogan);
};
