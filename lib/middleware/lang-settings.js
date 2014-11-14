"use strict";

module.exports = function languageSettings () {

  return function languageSettings(req, res, next){
    var lang = req.accept && req.accept.languages[0] || req.popit.setting('language');
    var defaultLang = req.popit.setting('language');
    res.locals.lang = lang;
    res.locals.defaultLang = defaultLang;
    next();
  };
};
