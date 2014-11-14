"use strict";

module.exports = function routeMiddleware(req, res, next) {
  req.base_url = res.locals.base_url = function base_url(path) {
    path = path || '';
    return req.protocol + '://' + req.headers.host + path;
  };

  req.current_absolute_url = function current_absolute_url() {
    return req.base_url(req.originalUrl);
  };

  res.locals.path = req.path;

  next();
};
