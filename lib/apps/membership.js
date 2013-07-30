"use strict"; 

var express       = require('../express-inherit'),
    winston       = require('winston'),
    Error404      = require('../errors').Error404,
    path          = require('path'),
    mkdirp        = require('mkdirp'),
    fs            = require('fs'),
    image         = require('./image'),
    utils         = require('../utils');


module.exports = function () {

  var app = express();
  
  app.locals({
    image_proxy: utils.image_proxy_helper
  });


  app.get('/', function (req,res) {
    res.send('FIXME - implement list page');
  });    
  
  app.param('membershipID', function (req, res, next, id) {
    req.popit
      .model('Membership')
      .findById(id)
      .populate('person_id')
      .populate('organization_id')
      .populate('post_id')
      .exec(function(err, doc) {
        if (err) winston.error( err );
        if (!doc) {
          next( new Error404() );
        } else {
          res.locals.membership = doc;
          req.object = doc;
          next();
        }
      });
  });
  
  app.get('/:membershipID', function(req,res) {
    res.render('membership/view.html');
  });
    
  return app;
};
