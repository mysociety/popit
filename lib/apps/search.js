exports.search = function( req, res, next ) {

    var search = req.param('q');
    if (!search) {
        return res.render('search');
    }
    req.popit.model('Person').name_search(search, function(docs) {
        if ( docs.length && docs.length == 1 ) {
            return res.redirect( '/person/' + docs[0].slug );
        }
        res.local('results', docs);
        res.render('search');
    });

};
