"use strict";

module.exports = function secureMiddleware(req, res, next) {
  // If the request is already secured then there's nothing more to do
  if (req.secure) {
    return next();
  }

  // Don't force the API to be SSL to preserve backwards compatibility
  var apiUrlRegex = /^\/api\//;
  if (apiUrlRegex.test(req.originalUrl)) {
    return next();
  }

  res.redirect('https://' + req.headers.host + req.originalUrl);
};
