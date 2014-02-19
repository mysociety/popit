"use strict";

var express            = require('../express-inherit'),
    Error404           = require('../errors').Error404,
    regexp_quote       = require('regexp-quote'),
    _                  = require('underscore');


var app = module.exports = express();

var autocomplete_model = function(model, attr) {
  return function(req, res) {
    var term = req.param(attr),
        query = req.popit
          .model(model)
          .find({}, 'id name label slug')
          .limit(10);
    if (term) {
      query = query.regex(attr, new RegExp( regexp_quote(term), 'i') );
    }
    query.exec(function(err,docs) {
      if (err) throw err;

      var suggestions = _.map(docs, function(item) {
        var a = { id: item.id };
        a[attr] = item[attr];
        if (item.slug) a.slug = item.slug;
        return a;
      });

      res.json(suggestions);
    });
  };
};

app.get('/persons', autocomplete_model('Person', 'name') );
app.get('/organizations', autocomplete_model('Organization', 'name') );
app.get('/posts', autocomplete_model('Post', 'label') );

app.get('/all_orgs', function(req, res) {
    req.popit
      .model('Organization')
      .find({}, 'id name')
      .sort('name')
      .exec(function(err,docs) {
      if (err) throw err;

      var suggestions = { '': 'None' };
      _.each(docs, function(i) {
          suggestions[i.id] = i.name;
      });
      res.json(suggestions);
    });
  }
);

var get_autocomplete_results = function ( model, field_path, term, cb ) {

  // create the default query
  var query = model
    .distinct(field_path);

  // if we have something to search for add it
  var term_re = false; // used later
  if ( term ) {
    term_re = new RegExp( '^' + regexp_quote(term), 'i');
    query = query
      .regex(field_path, term_re );
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

var autocomplete_results = function(model, field_path) {
  return function(req, res) {
    get_autocomplete_results(
      req.popit.model(model),
      field_path,
      req.param('term'),
      function (err, results) { if (err) throw err; res.json(results); }
    );
  };
};

app.get('/contact_type', autocomplete_results( 'Person', 'contact_details.type' ) );
app.get('/link_note', autocomplete_results( 'Person', 'links.note' ) );
app.get('/identifier_scheme', autocomplete_results( 'Person', 'identifiers.scheme' ) );
app.get('/memberships', autocomplete_results( 'Membership', 'role' ) );
