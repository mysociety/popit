"use strict";

var format = require('util').format;
var config = require('config');

function upgradeLegacyAccount(req, res, next) {
  if (!req.session.legacyInstanceId) {
    return next();
  }
  // User is trying to upgrade their account
  var instanceId = req.session.legacyInstanceId;
  delete req.session.legacyInstanceId;
  var Permission = req.popit.permissions();
  Permission.create({
    account: req.user.id,
    instance: instanceId,
    role: 'owner',
  }, function(err) {
    if (err) {
      return next(err);
    }
    req.flash('info', 'Account successfully upgraded');
    var Instance = req.popit.master().model('Instance');
    Instance.findById(instanceId, function(err, instance) {
      if (err) {
        return next(err);
      }
      // Redirect to the instance the user was trying to log into
      res.redirect(format(config.instance_server.base_url_format, instance.slug));
    });
  });
}

module.exports = upgradeLegacyAccount;
