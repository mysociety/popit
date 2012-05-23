var express       = require('express'),
    Error404      = require('../errors').Error404,
    path          = require('path'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs'),
    requireUser   = require('../middleware/route').requireUser,
    _             = require('underscore');


module.exports = function () {

  var migration = express.createServer();


  app.mounted(function(parent){

    var app = this;

    app.get('/', function (req,res) {

      var query = req.popit.model('Person').find().asc('name');

      query.run(function(err, docs) {
        if (err) throw err;

        res.local('people', docs);
        res.render('person');
      });
    });

  });

  return migration;
};
