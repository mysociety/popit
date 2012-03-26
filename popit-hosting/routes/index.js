var Validator     = require('validator').Validator,
    sanitize      = require('validator').sanitize,
    Instance      = require('../models/instance');


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

                // send an email with the create link in it                
                res.render(
                    'emails/new_instance.txt',
                    {
                        layout: false,
                        locals: {
                            instance: instance,
                            token: instance.setup_info.confirmation_token,
                            host: req.header('Host'),
                        },
                    },
                    function( err, output ) {
                        if (err) console.log( err );
                        console.log( output );
                        req.app.nodemailer_transport.sendMail(
                            {
                                // FIXME - replace with better email sending
                                to: instance.email,
                                subject: "New instance confirmation",
                                text: output,
                            }
                        );
                    }
                );

                // Have a new instance - redirect to 
                res.redirect( '/instance/' + instance.slug );
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

                // should 404 here instead.
                if (!instance) return next( new Error('no instance found') );

                req.instance = instance;
                next();
            }
        );
    });

    app.get( '/instance/:instanceSlug', function (req, res) {
            var template_file = 'instance_' + req.instance.status + '.html';
            res.render( template_file, {
                locals: {
                    instance: req.instance,
                },
            } );
    });


    // Check that the token is correct.
    function check_pending_and_token (req, res, next) {
        var instance = req.instance,
            token    = req.param.token;

        // if the instance is not pending redirect to the instance page
        if ( instance.status != 'pending' ) {
            return res.redirect( '/instance/' + instance.slug );
        }
        
        // if the token is wrong show the bad token page
        if (  req.params.token != req.instance.setup_info.confirmation_token ) {
            return res.render(
                'instance_confirm_wrong_token.html',
                {
                    locals: { instance: instance },
                }
            );
        }
        
        // nothing wrong here :)
        next();
    }
    
    app.all( '/instance/:instanceSlug/confirm/:token', check_pending_and_token, function (req, res) {

        res.send('good');


    });

};