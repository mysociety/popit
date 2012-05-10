var Validator     = require('validator').Validator,
    sanitize      = require('validator').sanitize,
    PopIt         = require('../../lib/popit'),
    utils         = require('../../lib/utils'),
    mailer        = require('../../lib/mailer'),
    Error404      = require('../../lib/errors').Error404;

exports.route = function (app) {

  app.get('/', function(req, res){
    res.redirect( '/person' ); // until we have a more interesting homepage to show
    // res.render( 'index' );
  });

  app.get('/image/:image_spec', function (req,res,next) {
  
    var image_bits = req.param('image_spec').split('-'),
        image_id   = image_bits[0],
        image_size = image_bits[1];
  
    // TODO - use an image 404 rather than an HTML one
    if( ! utils.is_ObjectId(image_id) ) return next(new Error404());
  
    req.popit.model("Image").findOne( {_id: image_id}, function(err,image) {
      if (err)    return next(err);
      if (!image) return next(new Error404());
  
      // FIXME - handle other sizes too
      if (image_size != 'original') return next(new Error404());
    
      res.header('Content-Type', image.mime_type);
      res.sendfile( req.popit.files_dir( image.local_path_original ) );    
    });
  });

  // Throw a 404 error
  app.all('/*', function(req, res, next) {
    next(new Error404());
  });

};


