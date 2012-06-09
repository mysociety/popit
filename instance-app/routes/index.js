var Error404 = require('../../lib/errors').Error404,
    requireUser = require('../../lib/middleware/route').requireUser,
    image = require('../../lib/apps/image');

exports.route = function (app) {

  app.get('/', function(req, res){
    res.redirect( '/person' ); // until we have a more interesting homepage to show
    // res.render( 'index' );
  });

  app.get('/image/:image_spec', image.get);
  app.get('/image/:image_spec/delete', requireUser, image.delete);

  // Throw a 404 error
  app.all('/*', function(req, res, next) {
    next(new Error404());
  });

};

