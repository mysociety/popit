"use strict";

var getLangs = require('../utils').getLangs;
var getLangName = require('../utils').getLangName;

module.exports = function languageSettings () {

  return function languageSettings(req, res, next){
    var langs = getLangs(req);
    res.locals.lang = langs.lang;
    res.locals.defaultLang = langs.defaultLang;
    res.locals.altLang = langs.altLang;
    res.locals.langName = getLangName(langs.lang);
    res.locals.defaultLangName = getLangName(langs.defaultLang);
    res.locals.altLangName = getLangName(langs.altLang);
    next();
  };
};
