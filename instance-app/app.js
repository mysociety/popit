
/**
 *  Instance Server
 */

var express           = require('express'),
    mongoose          = require('mongoose'),
    config            = require('config'),
    utils             = require('../lib/utils'),
    instanceSelector  = require('../lib/middleware/instance-selector')
    everyauth         = require('../lib/everyauth'),
    Db                = require('mongodb').Db,
    Server            = require('mongodb').Server,
    mongoStore        = require('connect-mongodb');

var app = module.exports = express.createServer();




// Configuration

app.configure(function(){
  app.use(express.logger('dev'));

  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  app.set('view options', { layout: false });

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
  everyauth.helpExpress(app);

  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// configure auth
everyauth.everymodule
    .findUserById( function (req, userId, callback) {
        var User = req.popit.model('User');
        User.findById(userId, callback);
    });    

everyauth.password
  .loginWith('email')
  .authenticate( function (login, password, req, res) {
        var promise = this.Promise()

        var User = req.popit.model('User');

        User.find({ email: login}, function (err, user) {
            if (err) return promise.fulfill([err]);

            utils.password_hash_compare(
                password,
                user.hashed_password,
                function(err, is_same) {
                    if (err) return promise.fulfill([err]);
                    if (! is_same) return promise.fulfill(['password wrong']);
                    return promise.fulfill(user);
                }
            );
        });

        return promise;
  });

// Routes
require('./routes').route(app);


app.listen( config.instance_server.port );
console.log(
    "PopIt Instance server listening on port %d in %s mode: foo.%s",
    app.address().port, app.settings.env, config.instance_server.domain_suffix
);
