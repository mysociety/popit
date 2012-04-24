var path          = require('path'),
    Error404      = require('../../lib/errors').Error404;

exports.route = function (app) {
    app.get('/info/:page', function(req, res, next){

      var template_file = req.app.set('views') + '/info/' + req.param('page') + '.jade';

      path.exists(template_file, function (exists) {
        if (exists) {
          res.render( 'info/' + req.param('page') );
        } else {
          next(new Error404());
        }
      });

    });   
};


