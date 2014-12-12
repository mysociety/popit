"use strict";

module.exports = function configMiddleware(req, res, next) {
  res.locals.disclaimer_text = req.popit.setting('disclaimer');
  next();
};
