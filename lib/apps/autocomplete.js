var express       = require('express'),
    Error404      = require('../errors').Error404,
    regexp_quote  = require('regexp-quote'),
    _             = require('underscore');


var app = module.exports = express.createServer();
  
app.mounted(function(parent){

  var app = this;
  

  app.get('/organisation_name', function (req,res) {
    var term = req.param('term');
    if (!term) return res.json([]);

    req.popit
      .model('Organisation')
      .find()
      .select('name','slug')
      .regex('name', new RegExp( regexp_quote(term), 'i') ) // FIXME - replace with something smarter - most likely something search engine based
      .limit(10)
      .run(function(err,docs) {
        if (err) throw err;

        var suggestions = _.map(docs, function(item) {
          return {label: item.name, value: item.slug };
        });

        res.json(suggestions);
      });

  });
    
  app.get('/position_title', function (req,res) {
    var term = req.param('term');
    if (!term) return res.json([]);

    req.popit
      .model('Position')
      .distinct('title')
      .regex('title', new RegExp( regexp_quote(term), 'i') ) // FIXME - replace with something smarter - most likely something search engine based
      .limit(10)
      .run(function(err,docs) {
        if (err) throw err;
        res.json(docs);
      });

  });
    
  app.get('/contact_kind', function (req,res) {
    var term = req.param('term');
    if (!term) return res.json([]);

    var term_re = new RegExp( '^' + regexp_quote(term), 'i');

    var query = req.popit
      .model('Person')
      .distinct('contact_details.kind')
      .regex('contact_details.kind', term_re )
      .limit(10)
      .run(function(err,docs) {
        if (err) throw err;

        // This will overfetch - as it will find all the people that match the query,
        // and then return all the contact_details.kinds that they have. We need to
        // filter this list down again.
        var results = _.filter( docs, function (kind) { return term_re.test(kind) } );

        res.json( results );
      });

  });
    
});
