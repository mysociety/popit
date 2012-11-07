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
      "define(\n  [\'underscore\'],\n  function(_) {\n    \'use strict\';\n    var AMD = function () {};\n    AMD.render = function ( templateName, data ) {\n  var self = this;\n\n  // create a version of this method that is bound to us\n  var localRender = function ( templateName, data ) {\n    return self.render( templateName, data );\n  };\n\n  // add in the function to the data so that it can be called in the templates\n  var augmentedData = _.extend(\n    {},\n    data,\n    { render: localRender }\n  );\n\n  // run the template and return the results.\n  return this.templates[templateName](augmentedData);\n};\n    AMD.templates = {};\n    \n      AMD.templates[inner.html] = function(obj){\nvar __t,__p=\'\',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,\'\');};\nwith(obj||{}){\n__p+=\'INNER_START\\n\'+\n((__t=( inner ))==null?\'\':__t)+\n\'\\nINNER_END\\n\';\n}\nreturn __p;\n};\n    \n      AMD.templates[outer.html] = function(obj){\nvar __t,__p=\'\',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,\'\');};\nwith(obj||{}){\n__p+=\'OUTER_START\\n\'+\n((__t=( outerPre ))==null?\'\':__t)+\n\'\\n\'+\n((__t=( render( \'inner.html\', { inner: inner } ) ))==null?\'\':__t)+\n\'\\n\'+\n((__t=( outerPost ))==null?\'\':__t)+\n\'\\nOUTER_END\\n\';\n}\nreturn __p;\n};\n    \n    };\n  }\n);\n"
    );
    test.done();
  },

};
