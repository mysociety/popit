"use strict";

var winston = require('winston'),
    config  = require('config');

// Set up the Winston logger and then return it.

module.exports = winston;


// remove the default transport
winston.remove(winston.transports.Console);

winston.add(
  winston.transports.Console,
  {
    colorize:         config.logging.colorize,
    level:            config.logging.log_level,
  }
);
