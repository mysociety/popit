"use strict"; 

var winston = require('winston');

var Error404 = function (msg) {
  this.name = 'Error404';
  Error.call( this, msg || 'Page not found' );
  Error.captureStackTrace(this, Error404);
};

Error404.prototype = Error.prototype;


module.exports = {
  Error404: Error404,

  // TODO - move to middleware
  errorHandler: function (err, req, res, next) {
    if(!err) next();

    if (err.name === 'Error404') {
      res.status(404).render('errors/404.html');
    } else {
      next(err);
    }

  },
};
