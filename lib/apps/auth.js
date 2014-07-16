"use strict"; 

var express                 = require('../express-inherit'),
    utils                   = require('../utils'),
    current_absolute_url    = require('../middleware/route').current_absolute_url,
    base_url                = require('../middleware/route').base_url,
    passport                = require('passport'),
    popit                   = require('../popit'),
    Account                 = require('../schemas/account'),
    LocalStrategy           = require('passport-local').Strategy;

// Legacy password check
passport.use('legacy', new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, function(req, username, password, done) {
  // Find the user, check password, store in session
  var User = req.popit.model('User');
  User.findOne({ email: username }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    utils.password_hash_compare(password, user.hashed_password, function(valid) {
      if (!valid) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      done(null, user);
    });
  });
}));

passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, function(req, username, password, done) {
    var account = req.popit.accounts();
    account.findByUsername(username, function(err, user) {
        if (err) { return done(err); }

        if (user) {
            return user.authenticate(password, done);
        } else {
            return done(null, false, { message: 'Invalid email or password' });
        }
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(req, id, done) {
  var User = req.popit.model('User');
  User.findById(id, function(err, user) {
    if (user) {
      return done(null, user);
    }

    req.popit.accounts().findById(id, done);
  });
});


var app = express();


var capture_common_parameters = function (req,res,next) {

  // If there is a redirect_to param use it to store the destination for
  // post auth
  var redirect_to = req.param('redirect_to');
  if (redirect_to) {
    req.session.post_login_redirect_to = redirect_to;
  }
  
  // Are we trying to login as a guest?
  res.locals.as_guest = req.param('as_guest') && req.popit.allow_guest_access() || false;

  next();
};

module.exports.capture_common_parameters = capture_common_parameters;

app.get('/login', capture_common_parameters, function (req,res) {

  // pass through some of the values
  res.locals.email  = req.param('email');
  res.locals.errors = [];

  res.render('login.html');
});


app.post(
  '/login',
  
  capture_common_parameters,
  
  // If this is for a guest then do the right thing
  // Otherwise get the email and password.
  // check we have both.
  // load the user
  function (req, res, next ) {

    // If we are trying to log in as guest skip on to next handler.
    if ( res.locals.as_guest  ) {
      req.session.is_guest = true;
      return next();
    }

    var errors = res.locals.errors = [];
    res.locals.email = req.body.email || '';

    passport.authenticate(['local', 'legacy'], function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        if (info && info[0] && info[0].message) {
          errors.push(info[0].message);
        }
        return res.render('login.html');
      }
      req.login(user, function(err) {
        if (err) {
          return next(err);
        }
        res.locals.user = user;
        next();
      });
    })(req, res, next);
  },
  
  // now logged in, redirect to where we should go
  function(req, res, next) {

    var redirect_to = req.session.post_login_redirect_to || '/';

    delete req.session.post_login_redirect_to;
    res.req.flash('info', 'You are now logged in.');
    res.redirect( redirect_to );
  }

);


app.get('/logout', function (req,res,next) {
  req.session = null;
  res.redirect('/');
});

app.get('/forgotten-password', function(req, res) {
  res.render('forgotten-password.html');
});

module.exports.app = app;


module.exports.middleware = function (req,res,next) {

  res.locals.user = req.user;

  if ( req.session.is_guest ) {
    if ( req.popit.allow_guest_access() ) {
      res.locals.guest = true;
      req.guest        = true;      
    } else {
      // guest access on longer allowed. Delete this from session
      delete req.session.is_guest;
    }
  }
  next();

};


module.exports.requireUser = function requireUser(req, res, next) {
  // if we have a user then continue
  if ( req.user ) return next();

  // Store our url on the session and get the user to log in.
  req.session.post_login_redirect_to = current_absolute_url(req);
  res.redirect( base_url(req) + '/login' );
};

module.exports.requireUserOrGuest = function requireUserOrGuest(req, res, next) {
  // if we have a user then continue
  if ( req.guest ) return next();

  // Otherwise pass on control
  module.exports.requireUser(req,res,next);
};

function unauthorized (res, realm) {
  res.setHeader('WWW-Authenticate', 'Basic realm="' + realm + '"');
  res.json({error: 'not authenticated'}, 401);
}

// much of this is taken from
// https://github.com/senchalabs/connect/blob/master/lib/middleware/basicAuth.js
module.exports.apiRequireUser = function apiRequireUser (req, res, next) {  

  var realm = "API";
  
  // If we are already authed then just continue
  if (req.user) return next();

  // If we don't have any auth info then bail out
  var authorization = req.headers.authorization;
  if (!authorization) return unauthorized(res, realm);

  var parts = authorization.split(' '),
      scheme = parts[0],
      credentials = new Buffer(parts[1], 'base64').toString().split(':'),
      username = credentials[0],
      password = credentials[1];

  // winston.verbose({scheme: scheme, username: username, password: password });

  if ('Basic' != scheme) {
    return next(
      require('utils').error(400, "Bad scheme: '" + scheme + "'")
    );
  }

  // check the user and pass against the database
  var User = req.popit.model('User');
  
  User.findOne( { email: username }, function (err, user) {
    if (err)   return next(err);
    if (!user) return unauthorized(res, realm);
    
    utils.password_hash_compare(
      password,
      user.hashed_password,
      function(is_same) {
        if (is_same) {
          req.user = user;
          next();
        } else {
          unauthorized(res, realm);
        }
      }
    );
  });
  
};


module.exports.apiRequireUserOrGuest = function apiRequireUserOrGuest (req, res, next) {  
  // If we are already guest then continue
  if (req.popit.allow_guest_access && req.guest) return next();

  // Otherwise pass on control
  module.exports.apiRequireUser(req,res,next);
};

