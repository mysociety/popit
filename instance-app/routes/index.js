var Validator     = require('validator').Validator,
    sanitize      = require('validator').sanitize,
    PopIt         = require('../../lib/popit'),
    utils         = require('../../lib/utils'),
    mailer        = require('../../lib/mailer');

exports.route = function (app) {

    app.get('/', function(req, res){
        res.render( 'index.html', { locals: res.locals() } );
    });
    
    app.get('/welcome', function(req, res){
        res.render( 'welcome.html', { locals: res.locals() } );
    });
    
};


