"use strict";

function upgradeLegacyAccount(req, res, next) {
  if (!req.session.legacyInstanceId) {
    return next();
  }
  // User is trying to upgrade their account
  var instanceId = req.session.legacyInstanceId;
  delete req.session.legacyInstanceId;
  var Permission = req.popit.permissions();
  Permission.grantPermission(req.user.id, instanceId, function(err) {
    if (err) {
      return next(err);
    }
    req.flash('info', 'Account successfully upgraded');
    next();
  });
}

module.exports = upgradeLegacyAccount;
