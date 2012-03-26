var Validator = require('validator').Validator,
    sanitize = require('validator').sanitize,
    Instance = require('../models/instance');


exports.route = function (app) {

    app.get('/', function(req, res){
        res.render( 'index.html' );
    });

    // Handle the post
    var new_post = function (req, res) {
        var slug     = req.param('slug', '').trim();
        var email    = req.param('email', '').trim();
        var password = '';

        // save all the values in case validation fails.
        res.locals({
            slug: slug,
            email: email,
        });

        // create a new instance
        var instance = new Instance({
            slug:  slug,
            email: email,
        });

        // save the instance
        instance.save(function (err) {
            if ( err ) {
                // store error and pass control to get method
                res.local( 'errors', err['errors'] );
                return new_get(req, res);
            } else {
                // Have a new instance - redirect to 
                res.redirect( '/instance/' + instance.slug )

                // send an email with the create link in it
                // FIXME
            }            
        });

    };

    var new_get = function (req, res) {
        res.local('title','New Instance');    
        res.render(
            'new.html', { locals: res.locals() } // why are locals not being passed through?
        );
    };

    app.post( '/instances/new', new_post );
    app.get(  '/instances/new', new_get  );
    
    
    // auto-load instance for the param instanceSlug
    app.param('instanceSlug', function(req, res, next, slug){
        Instance.findOne(
            { slug: slug },
            function ( err, instance ) {
                if (err) return next(err);
                if (!instance) return next( new Error('no instance found') );
                req.instance = instance;
                next();
            }
        );
    });

    app.get( '/instance/:instanceSlug', function (req, res) {
            res.render( 'instance_view.html', {
                locals: { instance: req.instance },
            } );
    });

};