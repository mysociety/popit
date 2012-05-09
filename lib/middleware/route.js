
// Express 2.5.9 handles redirects that start with '/' by homing them at 
// the mounted apps base. Which is wrong. Use full url to avoid this issue.

// not really middleware - should go somewhere more useful...
exports.base_url = function current_absolute_url (req) {
  var host        = req.headers.host;
  var tls         = req.connection.encrypted;
  return 'http' + (tls ? 's' : '') + '://' + host;
}

// not really middleware - should go somewhere more useful...
exports.current_absolute_url = function current_absolute_url (req) {
  return exports.base_url(req) + req.app.set('basepath') + req.url;
}

exports.requireUser = function requireUser(req, res, next) {
  // if we have a user then continue
  if ( req.user ) return next();

  // Store our url on the session and get the user to log in.
  req.session.post_login_redirect_to = exports.current_absolute_url(req);
  res.redirect( exports.base_url(req) + '/login' );
}
