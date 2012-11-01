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
      this.templates.render('inner.html', {inner: 'simple'}),
      "INNER_START\nsimple\nINNER_END\n"
    );
    test.done();
  },

  "test rendering a template with an include" : function (test) {
    test.expect(1);
    test.equal(
      this.templates.render(
        'outer.html',
        {
          outerPre:  'outer-pre',
          outerPost: 'outer-post',
          inner:     'nested',
        }
      ),
      "OUTER_START\nouter-pre\nINNER_START\nnested\nINNER_END\n\nouter-post\nOUTER_END\n"
    );
    test.done();
  },
  
  "test outputting as AMD module": function (test) {
    test.expect(1);
    test.equal(
      this.templates.asAMD(),
      "define(\n  [\'underscore\'],\n  function(_) {\n    \'use strict\';\n    var AMD = function () {};\n    AMD.render = function ( templateName, data ) {\n  var self = this;\n\n  // create a version of this method that is bound to us\n  var localRender = function ( templateName, data ) {\n    return self.render( templateName, data );\n  };\n\n  // add in the function to the data so that it can be called in the templates\n  var augmentedData = _.extend(\n    {},\n    data,\n    { render: localRender }\n  );\n\n  // run the template and return the results.\n  return this.templates[templateName](augmentedData);\n};\n    AMD.templates = {};\n    \n      AMD.templates[inner.html] = function(obj){\nvar __p=\'\';var print=function(){__p+=Array.prototype.join.call(arguments, \'\')};\nwith(obj||{}){\n__p+=\'INNER_START\\n\'+\n( inner )+\n\'\\nINNER_END\\n\';\n}\nreturn __p;\n};\n    \n      AMD.templates[outer.html] = function(obj){\nvar __p=\'\';var print=function(){__p+=Array.prototype.join.call(arguments, \'\')};\nwith(obj||{}){\n__p+=\'OUTER_START\\n\'+\n( outerPre )+\n\'\\n\'+\n( render( \'inner.html\', { inner: inner } ) )+\n\'\\n\'+\n( outerPost )+\n\'\\nOUTER_END\\n\';\n}\nreturn __p;\n};\n    \n    };\n  }\n);\n"
    );
    test.done();
  },

};
