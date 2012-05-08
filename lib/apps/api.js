var express       = require('express'),
    schemas       = require('../schemas');

var app = module.exports = express.createServer();

app.mounted( function (parent) {

  app.get('/', function (req, res, next) {
    res.json([]);
  });     

  add_schema( schemas.Person, {resource_name: 'person',} );

  app.all('*', function(req, res, next) {
    // 404
    res.json({ error: "page not found"}, 404);
  });

});

function add_schema ( schema, options ) {


  app.get( '/' + options.resource_name, function (req,res,next) {
    req.popit
      .model('Person')
      .find()
      .run(function (err, docs) {
        if (err) throw err;
        res.json(docs);
      });
  });

}