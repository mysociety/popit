"use strict"; 

var config      = require('config'),
    PopIt       = require('../popit'),
    utils       = require('../utils');

/**
 * Check Instance available:
 * 
 *   If an instance has been marked as down for maintenance then this sends
 *   out a 503 error
 *
 * @return {Function}
 * @api public
 */

module.exports = function checkInstanceAvailable () {
  return function isInstanceAvailable(req, res, next) {
    if ( req.popit.setting('unavailable') ) {
      res.status(503).render( 'errors/503.html' );
    } else {
      next();
    }
  };
};
