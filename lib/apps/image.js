var path          = require('path'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs');

exports.upload_image_get = function( req, res ) {
    res.render('image/upload_image');
};

exports.upload_image_post = function( req, res ) {
    console.log( req.files );

    if ( !req.files ) return exports.upload_image_get(req,res);

    var upload = req.files.image;
    if (!upload.size) return exports.upload_image_get(req,res);

    // FIXME - don't trust that we have an image

    // create an image object
    var image = new (req.popit.model('Image'))({
        mime_type: upload.type
    });

    var dest_path = req.popit.files_dir( image.local_path_original );

    // copy the image to the right place
    mkdirp( path.dirname(dest_path), function (err) {
        if (err) throw err;
        fs.rename( upload.path, dest_path, function(err) {
          if (err) throw err;

          // save the image
          image.save( function(err) {
            if (err) throw err;

            // add image to object and save
            var object = req.object;
            object.images.push(image);
            object.save(function(err) {
              if (err) throw err;
              // redirect to the object
              res.redirect( object.slug_url );
            })
          })
        });
    })
};

