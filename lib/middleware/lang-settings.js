"use strict";

var getLangs = require('../utils').getLangs;

module.exports = function languageSettings () {

  return function languageSettings(req, res, next){
    var langs = getLangs(req);
    res.locals.lang = langs.lang;
    res.locals.defaultLang = langs.defaultLang;
    res.locals.altLang = langs.altLang;
    next();
  };
};
