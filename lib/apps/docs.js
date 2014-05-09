"use strict";

var express = require('express');

module.exports = function () {
  var app = express();

  /**
   * Redirect all documentation requests to the new documentation site.
   *
   * @see http://popit.poplus.org/docs
   */
  app.get('*', function(req, res) {
    res.redirect(301, 'http://popit.poplus.org/docs');
  });

  return app;
};
