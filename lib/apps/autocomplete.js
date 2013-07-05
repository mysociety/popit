"use strict"; 

var express            = require('../express-inherit'),
    Error404           = require('../errors').Error404,
    regexp_quote       = require('regexp-quote'),
    _                  = require('underscore');


var app = module.exports = express();
  

app.get('/persons', function (req,res) {
  var term = req.param('name');
  if (!term) return res.json([]);

  req.popit
    .model('Person')
    .find({}, 'name slug')
    .regex('name', new RegExp( regexp_quote(term), 'i') ) // TODO - replace with something smarter - most likely something search engine based
    .limit(10)
    .exec(function(err,docs) {
      if (err) throw err;

      var suggestions = _.map(docs, function(item) {
        return { name: item.name, slug: item.slug };
      });

      res.json(suggestions);
    });

});

app.get('/organizations', function (req,res) {
  var term = req.param('name');
  if (!term) return res.json([]);

  req.popit
    .model('Organization')
    .find({}, 'name slug')
    .regex('name', new RegExp( regexp_quote(term), 'i') ) // TODO - replace with something smarter - most likely something search engine based
    .limit(10)
    .exec(function(err,docs) {
      if (err) throw err;

      var suggestions = _.map(docs, function(item) {
        return { name: item.name, slug: item.slug };
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
    // and then return all the contact_details.types that they have. We need to
    // filter this list down again.
    var results = _.filter( docs, function (value) {
      return term_re ? term_re.test(value) : true;
    });
  
    cb( null, results );
  });
  
};
  
app.get('/contact_type', function (req,res) {
  get_autocomplete_results(
    req.popit.model('Person'),
    'contact_details.type',
    req.param('term'),
    function (err, results) { if (err) throw err; res.json(results); }
  );
});
  
app.get('/link_note', function (req,res) {
  get_autocomplete_results(
    req.popit.model('Person'),
    'links.note',
    req.param('term'),
    function (err, results) { if (err) throw err; res.json(results); }
  );  
});  

app.get('/identifier_scheme', function (req,res) {
  get_autocomplete_results(
    req.popit.model('Person'),
    'identifiers.scheme',
    req.param('term'),
    function (err, results) { if (err) throw err; res.json(results); }
  );
});

app.get('/memberships', function (req,res) {
  get_autocomplete_results(
    req.popit.model('Membership'),
    'role',
    req.param('term'),
    function (err, results) { if (err) throw err; res.json(results); }
  );  
});
