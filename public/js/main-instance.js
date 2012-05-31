require(
  {    

    /**
     * NOTE - this is duplicated in app.build.js.
    **/

    baseUrl: '/js',
    
    paths: {
      "jquery":           './libs/jquery-1.7.2',
      "jquery.mailcheck": './libs/jquery.mailcheck.1.0.3.min',

      // AMD versions of these libraries:
      //   https://github.com/amdjs/backbone/blob/master/backbone.js
      //   https://github.com/amdjs/underscore/blob/master/underscore.js
      'underscore':       './libs/underscore-1.3.3-amd',
      'Backbone':         './libs/backbone-0.9.2-amd',
      'backbone-forms':   './libs/backbone-forms-0.9.0-amd',

      // Require.js plugins
      'text':  './libs/requirejs/text-1.0.8.min',
      'order': './libs/requirejs/order-1.0.5.min',
    },
  },
  [
  'augmenters/mailchecker',
  'augmenters/search-box',
  'augmenters/slug-validation',
  'augmenters/sign-in-toggle',
  'new-person',
  ]
);
