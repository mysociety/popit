

exports.requireUser = function requireUser(req, res, next) {
  // if we have a user then continue
  if ( req.user ) return next();

  // Express 2.5.9 handles redirects that start with '/' by homing them at 
  // the mounted apps base. Which is wrong. Use full url to avoid this issue.
  var host        = req.headers.host;
  var tls         = req.connection.encrypted;
  var base_url    = 'http' + (tls ? 's' : '') + '://' + host;
  var current_url = base_url + req.app.set('basepath') + req.url;

  // Store our url on the session and get the user to log in.
  req.session.post_login_redirect_to = current_url;    
  res.redirect( base_url + '/login' );
}
