"use strict"; 


// switch to testing mode
process.env.NODE_ENV = 'testing';

var _         = require('underscore'),
    Templates = require('../../lib/templates');

module.exports = {

  setUp: function (setUpDone) {

    // Create the template wrapper
    this.templates = new Templates({
      templateDir: __dirname + '/../../lib/sample_templates'
    });

    // init the templates, when done proceed
    this.templates.loadFromDir(
      __dirname + '/../../lib/sample_templates',
      setUpDone
    );
  },
    
  "test rendering a simple template" : function (test) {
    test.expect(1);
    test.equal(
      this.templates.render('inner.html'),
      "INNER_START\n\nINNER_END\n"
    );
    test.done();
  },

  "test rendering a template with an include" : function (test) {
    test.expect(1);
    test.equal(
      this.templates.render('outer.html'),
      "OUTER_START\n\nINNER_START\n\nINNER_END\n\n\nOUTER_END\n"
    );
    test.done();
  },

};
