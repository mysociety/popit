var Error404 = require('../../lib/errors').Error404;

exports.route = function (app) {

  app.get('/', function(req, res){
    res.redirect( '/person' ); // until we have a more interesting homepage to show
    // res.render( 'index' );
  });

  // Throw a 404 error
  app.all('/*', function(req, res, next) {
    next(new Error404());
  });

};

