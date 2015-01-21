"use strict";

var marked = require('marked');
var hogan = require('hogan.js');

function render(text, locals) {
  var template = hogan.compile(text);
  var rendered = template.render(locals);
  return marked(rendered, { sanitize: true });
}

module.exports = function licenseMiddleware(req, res, next) {
  var license = req.popit.setting('license');
  res.locals.license = render(license, { name: req.popit.pretty_name() });
  next();
};
