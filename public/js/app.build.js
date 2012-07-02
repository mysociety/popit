({

  appDir:  '../',
  dir:     '../../public-build',
  baseUrl: 'js',
  
  // We store all the config in one file and reference it from there to prevent
  // duplication.
  mainConfigFile: './require-config.js',
  
  modules: [
    {
      name: 'main-hosting',
    },
    {
      name: 'main-instance',
    },
  ]

})

