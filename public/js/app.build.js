({

  /**
   * NOTE - this is duplicated from main-hosting and main-instance.
  **/
   
  appDir: "../",
  dir: "../../public-production",
  baseUrl: 'js',
  
  paths: {
    // external libraries
    "jquery":           './libs/jquery-1.7.2.min',
    "jquery.mailcheck": './libs/jquery.mailcheck.1.0.3.min',
    // underscore: 'libs/underscore/underscore-min', // https://github.com/amdjs
    // backbone:   'libs/backbone/backbone-min', // https://github.com/amdjs
  
    // Require.js plugins
    'text':  './libs/requirejs/text-1.0.8.min',
    'order': './libs/requirejs/order-1.0.5.min',
  },
  
  modules: [
    {
      name: "main-hosting",
    },
    {
      name: "main-instance",
    },
  ]

})

