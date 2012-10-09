"use strict"; 

var restler         = require('restler'),
    config          = require('config'),
    utils           = require('../utils');


// create a simple accessor for getting at the api

module.exports = restler.service(
  function( slug, version ) {
    this.slug        = slug;
    this.api_version = version;
    this.baseURL     = utils.instance_base_url_from_slug( this.slug ) + '/api/' + this.api_version + '/';

    // these match the user created in the fixture
    this.defaults.username = 'owner@example.com';
    this.defaults.password = 'secret';
  },
  {  }
);
