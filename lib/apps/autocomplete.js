"use strict"; 

var express            = require('express'),
    Error404           = require('../errors').Error404,
    regexp_quote       = require('regexp-quote'),
    _                  = require('underscore'),
    partialDateParser  = require('../../lib/schemas/plugins/partial-date').parser,
    partialDateFormat  = require('../../lib/schemas/plugins/partial-date').format;


var app = module.exports = express();
  

app.get('/organisation_name', function (req,res) {
  var term = req.param('term');
  if (!term) return res.json([]);

  req.popit
    .model('Organisation')
    .find()
    .select('name','slug')
    .regex('name', new RegExp( regexp_quote(term), 'i') ) // TODO - replace with something smarter - most likely something search engine based
    .limit(10)
    .exec(function(err,docs) {
      if (err) throw err;

      var suggestions = _.map(docs, function(item) {
        return {label: item.name, value: item.slug };
      });

      res.json(suggestions);
    });

});
  
var get_autocomplete_results = function ( model, field_path, term, cb ) {

  // create the default query
  var query = model
    .distinct(field_path)
    .limit(10);
  
  // if we have something to search for add it
  var term_re = false; // used later
  if ( term ) {
    term_re = new RegExp( '^' + regexp_quote(term), 'i');
    query = query
      .regex(field_path, term_re )
      .sort(field_path);
  }
  
  // TODO if no query sort by popularity in db - so most used comes first.
  // Probably what user wants for things like contact details etc.

  // Run the query
  query.exec(function( err, docs ) {
    if (err) return cb(err);

    // This will overfetch - as it will find all the people that match the query,
    // and then return all the contact_details.kinds that they have. We need to
    // filter this list down again.
    var results = _.filter( docs, function (value) {
      return term_re ? term_re.test(value) : true;
    });
  
    cb( null, results );
  });
  
};
  
app.get('/contact_kind', function (req,res) {
  get_autocomplete_results(
    req.popit.model('Person'),
    'contact_details.kind',
    req.param('term'),
    function (err, results) { if (err) throw err; res.json(results); }
  );
});
  
app.get('/link_comment', function (req,res) {
  get_autocomplete_results(
    req.popit.model('Person'),
    'links.comment',
    req.param('term'),
    function (err, results) { if (err) throw err; res.json(results); }
  );  
});  

app.get('/position_title', function (req,res) {
  get_autocomplete_results(
    req.popit.model('Position'),
    'title',
    req.param('term'),
    function (err, results) { if (err) throw err; res.json(results); }
  );  
});



app.get('/partial_date', function (req,res) {

  var term = req.param('term');
  if (!term) return res.json([]);

  // First try to parse the date.
  var parsed = partialDateParser(term);
  if ( parsed && parsed.start ) {
    parsed.formatted = partialDateFormat( parsed.start, parsed.end );
    return res.json([parsed]);
  }

  // For now return an empty list - in future we would proceed to search the
  // database for named dates that match the term.
  res.json([]);
});
