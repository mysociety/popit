var Validator     = require('validator').Validator,
    sanitize      = require('validator').sanitize,
    Instance      = require('../models/instance'),
    UserSchema    = require('../models/schemas').UserSchema,
    mongoose      = require('mongoose'),
    utils         = require('../lib/utils');


exports.route = function (app) {

    app.get('/', function(req, res){
        res.render( 'index.html' );
    });

    // Handle the post
    var new_post = function (req, res) {
        var slug     = req.param('slug', '').trim();
        var email    = req.param('email', '').trim();
    
        // save all the values in case validation fails.
        res.locals({
            slug: slug,
            email: email,
        });
    
        utils.password_and_hash_generate( function (password, hash) {
    
            // create a new instance
            var instance = new Instance({
                slug:       slug,
                email:      email,
                setup_info: { password_hash: hash },
            });
            
            // save the instance
            instance.save(function (err) {
                if ( err ) {
                    // store error and pass control to get method
                    res.local( 'errors', err['errors'] );
                    return new_get(req, res);
                } else {
            
                    // send an email with the create link in it                
                    send_new_instance_email( req, res, instance, password );
            
                    // Have a new instance - redirect to 
                    res.redirect( '/instance/' + instance.slug );
                }            
            });
        });
    };
    
    function send_new_instance_email ( req, res, instance, password ) {
        res.render(
            'emails/new_instance.txt',
            {
                layout: false,
                locals: {
                    instance: instance,
                    token: instance.setup_info.confirmation_token,
                    host: req.header('Host'),
                    password: password,
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
    }
    
    var new_get = function (req, res) {
        res.local('title','New Instance');    
        res.render(
            'instance_new.html', { locals: res.locals() } // why are locals not being passed through?
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
            token    = req.params.token;
    
        // if the instance is not pending redirect to the instance page
        if ( instance.status != 'pending' ) {
            return res.redirect( '/instance/' + instance.slug );
        }
        
        // if the token is wrong show the bad token page
        if (  token != req.instance.setup_info.confirmation_token ) {
            return res.render(
                'instance_confirm_wrong_token.html',
                {
                    locals: { instance: instance },
                }
            );
        }
        
        // nothing wrong here :)
        res.locals({
            instance: instance,
            token: token,
        });
        next();
    }
    
      
    // for a get request just show the form - can't dive straight into creating the
    // instance as it may not be the user that is clicking on the confirm link - a
    // issue that caused FMT pain:
    //   https://nodpi.org/2011/06/22/vodastalk-vodafone-and-bluecoat-stalking-subscribers/
    app.get( '/instance/:instanceSlug/confirm/:token', check_pending_and_token, function (req, res) {
        return res.render( 'instance_confirm.html', { locals: res.locals() } );
    });
    
    app.post( '/instance/:instanceSlug/confirm/:token', check_pending_and_token, function (req, res) {
        var instance = req.instance;
        
        // If we've gotten this far then we should be able to create the new
        // instance.  If we can't we should regard it as a 500 error.
    
        // hook up to the new datbase
        var instance_db = mongoose.createConnection( utils.mongodb_connection_string( instance.slug ) );
        var User = instance_db.model('User', UserSchema);
        
        // create the entry needed in the users table
        user = new User({
            email: instance.email,
            hashed_password: instance.setup_info.password_hash,
        });
        user.save( function (err ) {
            if (err) throw err;

            // update the all database
            instance.status = 'active';
            instance.save( function (err) {
                if ( err ) throw err;

                // redirect user to new domain once save has completed
                // res.redirect( 'http://' + instance.slug + '.popitdomain.org' );
                res.send( 'Should redirect you to http://' + instance.slug + '.popitdomain.org at this point, but there is nothing there to receive you --- yet.' );            
            });
        });
        
    });
    
};


