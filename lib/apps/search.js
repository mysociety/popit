var regexp_quote  = require('regexp-quote');

exports.search = function( req, res, next ) {

    var search = req.param('q');
    if (!search) {
        return res.render('search');
    }

    req.popit
      .model('Person')
      .find()
      .select('name','slug')
      .regex('name', new RegExp( regexp_quote(search), 'i') )
      .exec(function(err,docs) {
        if (err) throw err;
        if ( docs.length == 1 ) {
            return res.redirect( '/person/' + docs[0].slug );
        }
        res.local('results', docs);
        res.render('search');
    });

};
