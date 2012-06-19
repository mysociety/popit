var express   = require('express'),
path          = require('path'),
url           = require('url'),
http          = require('http'),
utils         = require('../utils');

module.exports = function () {
  
  var instanceinfo_app = express.createServer();

  var sync = function(req, res){
    var instanceInfo = req.popit.model('InstanceInfo');

    req.popit.model('Instance').find( function (err, docs) {
      if (err) throw err;

      docs.forEach(function(doc) {
        var instanceAPIURL = utils.instance_base_url_from_slug( doc.slug ) + '/api/v1/about/';

        http.get(url.parse(instanceAPIURL), function(res){
          var aboutJSON = '';

          res.on('data', function (chunk){
            aboutJSON += chunk;
          });

          res.on('end',function(){

            var aboutObj = JSON.parse(aboutJSON).result;
//            aboutObj.description = "upserted " + Math.random();
            aboutObj.instance = doc;

            instanceInfo.update({
              instance: doc._id
              }, aboutObj, {
              upsert: true
            }, function(err){
              if (err) throw err;
            });
            
          })
        });
      });
    })
  }

  instanceinfo_app.get('/', function(req, res, next){

      var query = req.popit.model('InstanceInfo').find().asc('name');

      query.run(function(err, docs) {
        if (err) throw err;

        res.local('instances', docs);
        res.render('instanceinfo');
      });
  });

  instanceinfo_app.sync = sync;
  
  return instanceinfo_app;
};
