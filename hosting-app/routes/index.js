"use strict"; 

var winston       = require('winston'),
    PopIt         = require('../../lib/popit'),
    utils         = require('../../lib/utils'),
    mailer        = require('../../lib/mailer'),
    moment        = require('moment'),
    _             = require('underscore'),     
    config        = require('config'),
    Error404      = require('../../lib/errors').Error404,
    format        = require('util').format;

exports.route = function (app) {

    app.get('/', function(req, res){
        // Redirect production site to the documentation site for now.
        // TODO: Undo this once we're happy with the homepage.
        if (req.host === 'popit.mysociety.org') {
            res.redirect('http://popit.poplus.org/');
        } else {
            res.render('index.html');
        }
    });

    // Handle the post
    var new_post = function (req, res) {
        var slug     = req.param('slug', '').trim();
        var email    = req.param('email', '').trim();
    
        // save all the values in case validation fails.
        res.locals.slug  = slug;
        res.locals.email = email;

        utils.password_and_hash_generate( function (password, hash) {
    
            // create a new instance
            var Instance = req.popit.model('Instance');
            var instance = new Instance({
                slug:       slug,
                email:      email,
                setup_info: { password_hash: hash },
            });
            
            // save the instance
            instance.save(function (err) {
                if ( err ) {
                    // store error and pass control to get method
                    res.locals.errors = err.errors;
                    return new_get(req, res);
                } else {
            
                    // send an email with the create link in it                
                    send_new_instance_email( req, res, instance, password );
            
                    // Have a new instance - redirect to 
                    res.redirect( '/instances/' + instance.slug );
                }            
            });
        });
    };
    
    function send_new_instance_email ( req, res, instance, password ) {
    
        var template_args = {
          instance: instance,
          token:    instance.setup_info.confirmation_token,
          host:     req.header('Host'),
          password: password,
        };
        
        res.render(
            'emails/new_instance.txt',
            template_args,
            function( err, output ) {
                if (err) winston.error( err );
                mailer.send(
                    req,
                    {
                        to: instance.email,
                        subject: "New instance confirmation",
                        text: output,
                    }
                );
            }
        );        
    }
    
    var new_get = function (req, res) {
      _.defaults(
        res.locals,
        {
          title:  'New Instance',
          errors: {},
          email: '',
          slug: '',
        }
      );
      res.render('instance_new.html');
    };
    
    app.post( '/instances/new', new_post );
    app.get(  '/instances/new', new_get  );
    
    
    // auto-load instance for the param instanceSlug
    app.param('instanceSlug', function(req, res, next, slug){
        req.popit.model('Instance').findOne(
            { slug: slug },
            function ( err, instance ) {
                if (err) {
                    return next(err);
                }
    
                // should 404 here instead.
                if (!instance) return next( new Error404('no instance found') );
    
                req.instance = instance;
                next();
            }
        );
    });
    
    app.get( '/instances/:instanceSlug', function (req, res) {
      if ( req.instance.status !== 'pending' ) {
        return res.redirect(format(config.instance_server.base_url_format, req.param('instanceSlug')));
      }

      res.render('instance_pending.html', {
        instance: req.instance,
        moment: moment,
      });
    });
    
    
    // Check that the token is correct.
    function check_pending_and_token (req, res, next) {
        var instance = req.instance,
            token    = req.params.token;
    
        res.locals.instance = instance;
        res.locals.token    = token;

        // if the instance is not pending redirect to the instance page
        if ( instance.status != 'pending' ) {
            return res.redirect( '/instances/' + instance.slug );
        }
        
        // if the token is wrong show the bad token page
        if ( token != req.instance.setup_info.confirmation_token ) {
            return res.render('instance_confirm_wrong_token.html');
        }
        
        // nothing wrong here :)
        next();
    }
    
      
    // for a get request just show the form - can't dive straight into creating the
    // instance as it may not be the user that is clicking on the confirm link - a
    // issue that caused FMT pain:
    //   https://nodpi.org/2011/06/22/vodastalk-vodafone-and-bluecoat-stalking-subscribers/
    app.get( '/instances/:instanceSlug/confirm/:token', check_pending_and_token, function (req, res) {
        return res.render( 'instance_confirm.html' );
    });
    
    app.post( '/instances/:instanceSlug/confirm/:token', check_pending_and_token, function (req, res, next) {
        var instance = req.instance;
        
        // If we've gotten this far then we should be able to create the new
        // instance.  If we can't we should regard it as a 500 error.
    
        // hook up to the new datbase
        var new_popit = new PopIt();
        new_popit.set_instance( instance.slug );

        var User = new_popit.model('User');

        // save the user's email address to the 'email_from' setting
        new_popit.load_settings( function (err) {
            if (err) {
                return next(err);
            }
            new_popit.set_setting( 'email_from', instance.email, function (err) {
                if (err) {
                    return next(err);
                }

                // create the entry needed in the users table
                var user = new User({
                    email: instance.email,
                    hashed_password: instance.setup_info.password_hash,
                });
                user.save( function (err ) {
                    if (err) {
                        return next(err);
                    }

                    // update the master database
                    instance.status = 'active';
                    instance.save( function (err) {
                        if (err) {
                            return next(err);
                        }

                        // create a token in the instance to log the user in
                        var Token = new_popit.model('Token');
                        var token = new Token({
                          action: 'login',
                          args: {
                            user_id: user.id,
                            redirect_to: instance.base_url + '/'
                          },
                        });

                        token.save(function(err) {
                          if (err) {
                            return next(err);
                          }

                          res.redirect( instance.base_url + '/token/' + token.id );
                        });
                    });
                });            
            });
        });
        
    });
    
    app.get('/instances', function(req, res, next){

        var query = req.popit.model('Instance').find({status: 'active'});

        query.exec(function(err, docs) {
          if (err) {
            return next(err);
          }

          res.locals.instances = docs;
          res.render('instances.html');
        });
    });

    // Throw a 404 error
    app.all('/*', function(req, res, next) {
      next(new Error404());
    });
    
};


