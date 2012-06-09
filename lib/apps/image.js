var path          = require('path'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs'),
    Error404      = require('../../lib/errors').Error404,
    utils         = require('../utils');

exports.get = function( req, res, next ) {

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

};

exports.delete = function( req, res, next ) {

    var image_id = req.param('image_spec');
    if( ! utils.is_ObjectId(image_id) ) return next(new Error404());

    req.popit.model("Image").findOne( {_id: image_id}, function(err,image) {
        if (err)    return next(err);
        if (!image) return next(new Error404());
        req.flash('info', 'Image deleted');

        // XXX
        image.remove();
        fs.unlink( req.popit.files_dir( image.local_path_original ) );

        var org_model = req.popit.model('Organisation'),
            person_model = req.popit.model('Person');
        org_model.findOne({ images: image_id }, function(err, object) {
            if (err) return next(err);
            if (!object) return;
            org_model.update( { images: image_id }, { $pull : { images : image_id } }, function() {
                res.redirect( object.slug_url );
            });
        });
        person_model.findOne({ images: image_id }, function(err, object) {
            if (err) return next(err);
            if (!object) return;
            person_model.update( { images: image_id }, { $pull : { images : image_id } }, function() {
                res.redirect( object.slug_url );
            });
        });

    });

};

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

