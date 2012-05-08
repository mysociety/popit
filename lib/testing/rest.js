var restler         = require('restler'),
    config          = require('config');


// create a simple accessor for getting at the api

module.exports = restler.service(
  function( slug, version ) {
    this.slug        = slug;
    this.api_version = version;
    this.baseURL     = 'http://' + this.slug + '.' + config.instance_server.domain_suffix + '/api/' + this.api_version + '/';
  },
  {  }
);
