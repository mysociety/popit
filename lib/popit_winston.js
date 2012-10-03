var winston = require('winston'),
    config  = require('config'),
    _       = require('underscore'),
    path    = require('path'),
    mkdirp  = require('mkdirp');

// Set up the Winston logger and then return it.

module.exports = winston;


// remove the default transport
winston.remove(winston.transports.Console);


// console
if ( config.logging.log_to_console) {

  winston.add(
    winston.transports.Console,
    {
      colorize:         true,
      level:            config.logging.log_level,
      handleExceptions: true,
    }
  );  
}


// file
if ( config.logging.log_to_file) {

  // Get filename and create parent directory if needed
  var filename = path.join( config.logging.log_directory, 'app_log' );
  mkdirp.sync( path.dirname( filename ) );

  winston.add(
    winston.transports.File,
    {
      filename:         filename,
      maxsize:          1024 * 1024, // 1MB
      json:             false,
      level:            config.logging.log_level,
      handleExceptions: true, 
    }
  );  
}

var subdomain = process.env.LOGGLY_SUBDOMAIN;
var token     = process.env.LOGGLY_INPUT_TOKEN;
if ( subdomain && token ) {
  var Loggly = require('winston-loggly').Loggly;
  
  winston.add(
    Loggly,
    {
      subdomain:        subdomain,
      inputToken:       token,
      level:            config.logging.log_level,
      handleExceptions: true,
      json:             true,
    }
  );
  
}

