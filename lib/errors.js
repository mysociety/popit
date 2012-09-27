var winston = require('winston');

function Error404 (msg) {
  this.name = 'Error404';
    Error.call(this, msg || 'Page not found');
  Error.captureStackTrace(this, arguments.callee);
}

Error404.prototype.__proto__ = Error.prototype;


module.exports = {
  Error404: Error404,

  // TODO - move to middleware
  errorHandler: function (err, req, res, next) {
    if(!err) next();

    if (err instanceof Error404) {
      res.render('errors/404', {status: 404});
    } else {
      winston.error( err.stack );
      next(err);
    }

  },
};
