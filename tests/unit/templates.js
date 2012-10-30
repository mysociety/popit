"use strict"; 


// switch to testing mode
process.env.NODE_ENV = 'testing';

var _         = require('underscore'),
    templates = require('../../lib/templates');

module.exports = {
    
  "test loading basic templates" : function (test) {
    test.expect(2);
    templates.getTemplates({}, function(err, templates) {
      test.ifError(err);
      test.deepEqual(
        _.keys(templates).sort(),
        ['inner.html','outer.html']
      );
      test.done();
    });
  },
  
  "test rendering a simple template" : function (test) {
    test.expect(2);
    templates.getTemplates({}, function(err, templates) {
      test.ifError(err);
      test.equal(
        templates['inner.html'](),
        "INNER_START\n\nINNER_END\n"
      );
      test.done();
    });
  },

  "test rendering a template with an include" : function (test) {
    test.expect(2);
    templates.getTemplates({}, function(err, templates) {
      test.ifError(err);
      test.equal(
        templates['outer.html'](),
        "OUTER_START\n\nINNER_START\n\nINNER_END\n\n\nOUTER_END\n"
      );
      test.done();
    });
  },

};
