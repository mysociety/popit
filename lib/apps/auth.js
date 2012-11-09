"use strict"; 

var express       = require('../express-inherit'),
    utils         = require('../utils');


var app = express();


var capture_redirect_to = function (req,res,next) {

  // If there is a redirect_to param use it to store the destination for
  // post auth
  var redirect_to = req.param('redirect_to');
  if (redirect_to) {
    req.session.post_login_redirect_to = redirect_to;
  }  

  next();
};


app.get('/login', capture_redirect_to, function (req,res) {

  // pass through some of the values
  res.locals.email  = req.param('email');
  res.locals.errors = [];

  res.render('login.html');
});


app.post(
  '/login',
  
  capture_redirect_to,
  
  // get the email and password.
  // check we have both.
  // load the user
  function(req,res,next) {
    
    var email    = (req.body.email    || '').toLowerCase().trim();
    var password = req.body.password || '';
  
    res.locals.email = email;
    var errors = res.locals.errors = [];
  
    if ( !email )     errors.push('Missing login');
    if ( ! password ) errors.push('Missing password');

    if (errors.length ) {
      return res.render('login.html');
    }

    // Find the user, check password, store in session
    var User = req.popit.model('User');
    User.findOne({email: res.locals.email }, function(err, user) {

      if (err) return next(err);

      if ( !user ) {
        errors.push('credentials wrong');
        return res.render('login.html');
      }

      utils.password_hash_compare(password, user.hashed_password, function (is_correct) {

        if (!is_correct) {
          res.locals.errors = ['Email or password is not correct'];
          return res.render('login.html');
        }

        // Have correct user, store in session.
        res.locals.user            = user;
        req.session.loggedInUserId = user.id;
        next();
      });
    });
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
  req.session.destroy(function(err){
    if (err) return next(err);
    res.redirect('/');
  });
});



module.exports.app = app;


module.exports.middleware = function (req,res,next) {

  // try to load from session
  var user_id = req.session.loggedInUserId;

  if (!user_id) {
    return next();
  }

  var User = req.popit.model('User');
  
  User.findById( user_id, function (err, user) {
    res.locals.user = user;
    req.user        = user;
    return next(err);
  });

};

