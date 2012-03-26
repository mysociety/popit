var Validator = require('validator').Validator,
    sanitize = require('validator').sanitize,
    Instance = require('../models/instance');


exports.route = function (app) {

    app.get('/', function(req, res){
        res.render(
            'index.html',
            {
                locals: { title: 'Express' }
            }
        );
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

        // var instance = new Instance();
        // instance.slug = slug;
        // instance.email = email;
        var instance = new Instance({
            slug:  slug,
            email: email,
        });

        instance.save(function (err) {
            if ( err ) {
                console.log( err );
                res.local( 'errors', err['errors'] );
                return new_get(req, res);
            } else {
                // FIXME no errors - should really do some creating here
                res.local('title','Instance Created');    
                res.render(
                    'new.html', { locals: res.locals() } // why are locals not being passed through?
                );
            }
            
        });
        
        console.log( instance );
        Instance.findOne({ slug: slug }, function(err, doc) { console.log(err,doc) });

    };

    var new_get = function (req, res) {

        res.local('title','New Instance');    
        res.render(
            'new.html', { locals: res.locals() } // why are locals not being passed through?
        );

    };


    app.post( '/new', new_post );
    app.get(  '/new', new_get  );
    

};
