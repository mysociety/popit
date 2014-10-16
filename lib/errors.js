"use strict"; 

var winston = require('winston');

var Error404 = function (msg) {
  this.name = 'Error404';
  Error.call( this, msg || 'Page not found' );
  Error.captureStackTrace(this, Error404);
};

Error404.prototype = Error.prototype;

var Error401 = function (msg) {
  this.name = 'Error401';
  Error.call( this, msg || 'Unauthorized' );
  Error.captureStackTrace(this, Error401);
};

Error401.prototype = Error.prototype;

module.exports = {
  Error404: Error404,
  Error401: Error401,

  // TODO - move to middleware
  errorHandler: function (err, req, res, next) {
    if(!err) next();

    if (err.name === 'Error404') {
      res.status(404).render('errors/404.html');
    } else if (err.name === 'Error401') {
      res.status(401).render('errors/401.html');
    } else {
      next(err);
    }

  },
};
