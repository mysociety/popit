"use strict"; 

var request = require('request');

exports.search = function( req, res, next ) {

    var search = req.param('q');
    if (!search) {
      res.locals.results = [];
      return res.render('search.html');
    }

    var url = req.base_url('/api/v0.1/search/');

    request(url + 'organizations' + '?q=name:' + search, function(err, searchRes, body) {
      var results = JSON.parse(body);
      res.locals.results = results.result;
      // TODO: handle results with more than one page here

      request(url + 'persons' + '?q=name:' + search, function(err, searchRes, body) {
        var results = JSON.parse(body);
        // TODO: handle results with more than one page here
        res.locals.results = res.locals.results.concat(results.result);
        res.render('search.html');
      });
    });

};
