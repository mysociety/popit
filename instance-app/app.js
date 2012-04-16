
/**
 *  Instance Server
 */

var express           = require('express'),
    mongoose          = require('mongoose'),
    config            = require('config'),
    utils             = require('../lib/utils'),
    instanceSelector  = require('../lib/middleware/instance-selector')
    everyauth         = require('everyauth'),
    Db                = require('mongodb').Db,
    Server            = require('mongodb').Server,
    mongoStore        = require('connect-mongodb');

// everyauth.debug = true;

// configure auth
everyauth
  .everymodule
    .findUserById( function (req, userId, callback) {
        var User = req.popit.model('User');
        User.findById(userId, callback);
    });    

everyauth
  .password
    .loginWith('email')
    .getLoginPath('/login') // Uri path to the login page
    .postLoginPath('/login') // Uri path that your login form POSTs to
    .loginView('login.jade')
    .authenticate( function (login, password, req, res) {
          if (!login)    return ['Missing login'];
          if (!password) return ['Missing password'];      
    
          var promise = this.Promise()
    
          var User = req.popit.model('User');
    
          User.findOne( { email: login }, function (err, user) {
              if (err)   return promise.fulfill([err]);
              if (!user) return promise.fulfill(['credentials wrong']);
    
              utils.password_hash_compare(
                  password,
                  user.hashed_password,
                  function(is_same) {
                      if (! is_same) return promise.fulfill(['credentials wrong']);
                      return promise.fulfill(user);
                  }
              );
          });
    
          return promise;
    })
    .loginSuccessRedirect('/')
    .getRegisterPath('/register')
    .postRegisterPath('/register')
    .registerView('does-not-exist.html')
    .registerUser( function (newUserAttrs) {} )
    .registerSuccessRedirect('/');


var app =  express.createServer();



// Configuration

app.configure(function(){
  app.use(express.logger('dev'));
  
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  app.set('view options', {
      layout: false,
      pretty: true,
      // debug: true,
  });
  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  
  // sessions and auth
  app.use( express.cookieParser( config.instance_server.cookie_secret ) );
  var session_db_name = config.MongoDB.popit_prefix + config.MongoDB.session_name;
  var session_server  = new Server(
      config.MongoDB.host,
      config.MongoDB.port,
      {auto_reconnect: true, native_parser: true}
  );
  var session_db = new Db( session_db_name, session_server, {} );
  var session_store = new mongoStore({ db: session_db });
  
  app.use( express.session({
      secret: config.instance_server.cookie_secret,
      store: session_store,
  }) );
  
  // Select the instance now so that it is available to everyauth to refer to
  // the correct db with.
  app.use(instanceSelector());
  
  app.use( everyauth.middleware() );
  
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


require('./routes').route(app);      

app.listen( config.instance_server.port );

console.log(
    "PopIt Instance server listening on port %d in %s mode: foo.%s",
    app.address().port, app.settings.env, config.instance_server.domain_suffix
);

module.exports = app;
