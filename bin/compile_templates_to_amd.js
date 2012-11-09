#!/usr/bin/env node

var Template = require('../lib/templates'),
    path     = require('path');

var templates = new Template();

var views_dir = path.normalize(
  path.join(
    __dirname, '../instance-app/views/'
  )
);

templates.loadFromDir(
  views_dir,
  function (err) {
    if (err) throw err;
    process.stdout.write( templates.asAMD() );
  }
);