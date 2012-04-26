var Validator     = require('validator').Validator,
    sanitize      = require('validator').sanitize,
    PopIt         = require('../../lib/popit'),
    utils         = require('../../lib/utils'),
    mailer        = require('../../lib/mailer'),
    Error404      = require('../../lib/errors').Error404;

exports.route = function (app) {

    app.get('/', function(req, res){
        res.render( 'index' );
    });
    // Throw a 404 error
    app.all('/*', function(req, res, next) {
      next(new Error404());
    });
        
};


