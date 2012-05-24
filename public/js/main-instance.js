require(
  {    

    /**
     * NOTE - this is duplicated in app.build.js.
    **/

    baseUrl: '/js',
    
    paths: {
      "jquery":           './libs/jquery-1.7.2.min',
      "jquery.mailcheck": './libs/jquery.mailcheck.1.0.3.min',

      // AMD versions of these libraries:
      //   https://github.com/amdjs/backbone/blob/master/backbone.js
      //   https://github.com/amdjs/underscore/blob/master/underscore.js
      'underscore': './libs/underscore-1.3.3-amd',
      'backbone':   './libs/backbone-0.9.2-amd',

      // Require.js plugins
      'text':  './libs/requirejs/text-1.0.8.min',
      'order': './libs/requirejs/order-1.0.5.min',
    },
  },
  [
  'mailchecker',
  'search-box',
  'slug-validation',
  'sign-in-toggle',
  ]
);
