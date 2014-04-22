"use strict"; 

exports.search = function( req, res, next ) {

    var search = req.param('q');
    if (!search) {
      res.locals.results = [];
      return res.render('search.html');
    }
    req.popit.model('Person').name_search(search, function(err,docs) {
      if (err) return next(err);
        if ( docs.length && docs.length == 1 ) {
            return res.redirect( docs[0].url );
        }
        res.locals.results = docs;
        res.render('search.html');
    });

};
