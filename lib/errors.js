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
      res.render('errors/404', {status: 404});
    } else {
      winston.error( err.stack );
      next(err);
    }

  },
};
