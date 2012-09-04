var Error404 = require('../../lib/errors').Error404,
    async    = require('async');

exports.route = function (app) {

  app.get('/search',  require('../../lib/apps/search').search );

  app.get('/', function(req, res, next){

    async.parallel(
      {
        persons: function (callback) {
          req.popit
            .model('Person')
            .find()
            .limit(10)
            .exec(callback);
        },
      },
      function(err, results) {
        if (err) return next(err);
        res.locals(results);
        res.render('index');
      }
    );

  });

  app.get('/welcome', function (req, res) {
    res.render('welcome');
  });

  // Throw a 404 error
  app.all('/*', function(req, res, next) {
    next(new Error404());
  });

};

