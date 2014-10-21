"use strict";

module.exports = function routeMiddleware(req, res, next) {
  req.base_url = function base_url() {
    return req.protocol + '://' + req.headers.host;
  };

  req.current_absolute_url = function current_absolute_url() {
    return req.base_url() + req.originalUrl;
  };

  next();
};
