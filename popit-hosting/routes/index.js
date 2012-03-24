var Validator = require('validator').Validator,
    sanitize = require('validator').sanitize;


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
        var instance_key = req.param('instance_key', '').trim();
        var email        = req.param('email', '').trim();
        var password     = '';

        res.locals({
            instance_key: instance_key,
            email: email,
            password: password,        
        });

        var errors = {};
        res.local('errors', errors );
        
        var v = new Validator;
        v.error = function (msg) {
            errors[msg] = true;
            return this;
        };
        
        v.check(instance_key, 'instance_key').len(4,20).is(/^[a-z][a-z0-9\-]+$/);
        v.check(email, 'email').isEmail();

        // Check that the instance name is not is use.

        if ( errors.length ) {
            return new_get(req, res);
        } else {
            // FIXME no errors - should really do some creating here
            res.local('title','Instance Created');    
            res.render(
                'new.html', { locals: res.locals() } // why are locals not being passed through?
            );
        }
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
