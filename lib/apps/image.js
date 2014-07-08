"use strict"; 

var path          = require('path'),
    async         = require('async'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs-extra'),
    Error404      = require('../../lib/errors').Error404,
    check         = require('validator').check,
    utils         = require('../utils'),
    config        = require('config'),
    reIndex       = require('popit-api').reIndex;

exports.get = function( req, res, next ) {

    var image_id = req.param('image_spec');

    // TODO - use an image 404 rather than an HTML one
    if( ! utils.is_ObjectId(image_id) ) return next(new Error404());

    async.detect(req.object.images, function(item, callback) {
        if ( image_id == item.id ) callback(item);
        else callback();
    }, function(image) {
        if (!image) return next(new Error404());
        res.set('Content-Type', image.mime_type);
        res.sendfile( req.popit.files_dir( image.local_path ) );
    });

};

exports.delete = function( req, res, next ) {

    var image_id = req.param('image_spec');
    if( ! utils.is_ObjectId(image_id) ) return next(new Error404());

    async.detect(req.object.images, function(item, callback) {
        if (image_id == item.id) callback(item);
        else callback();
    }, function(image) {
        if (!image) return next(new Error404());
        req.flash('info', 'Image deleted');

        if ( !image.url ) {
            fs.unlink( req.popit.files_dir( image.local_path ) );
        }

        var idx = req.object.images.indexOf(image);
        if ( idx > -1 ) {
            req.object.images.splice(idx, 1);
            // do this as an update to stop it falling over if we have some bad data
            // in things like other_names. see issue 528 for details
            req.object.update({ $set: { images: req.object.images } }, function(err) {
                if (err) {
                    return next(err);
                }
                reIndex(config.MongoDB.popit_prefix + req.popit.instance_name(), function(err) {
                    if (err) {
                        return next(err);
                    }
                    res.redirect( req.object.url );
                });
            });
        }
    });

};

exports.upload_image = function( req, res, next ) {

    var url    = req.param('url');
    var upload = req.files.image || {};

    // Neither, or both provided. TODO relevant error message
    if ( (upload.size && url) || !(upload.size || url) ) {
        return res.render( 'image/upload_image.html' );
    }

    if ( url ) {
        check(url).isUrl();
    }

    // FIXME - don't trust that we have an image

    function save_to_object(image) {
        var object = req.object;
        object.images.push(image);
        // do this as an update to stop it falling over if we have some bad data
        // in things like other_names. see issue 528 for details
        object.update({ $set: { 'images': object.images } }, function(err) {
            if (err) {
                return next(err);
            }
            reIndex(config.MongoDB.popit_prefix + req.popit.instance_name(), function(err) {
                if (err) {
                    return next(err);
                }
                // redirect to the object
                res.redirect( object.url );
            });
        });
    }

    if ( url ) {
        save_to_object(
            new (req.popit.model('Image'))({ url: url })
        );
        return;
    }

    var image = new (req.popit.model('Image'))({
        mime_type: upload.type
    });

    var dest_path = req.popit.files_dir( image.local_path );

    // copy the image to the right place
    mkdirp( path.dirname(dest_path), function (err) {
        if (err) throw err;
        fs.move( upload.path, dest_path, function(err) {
            if (err) throw err;
            save_to_object(image);
        });
    });
};

