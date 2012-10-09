"use strict"; 

var config      = require('config'),
    PopIt       = require('../popit');

/**
 * Master Selector:
 * 
 *   Set the instance to be the master.
 *
 *     connect()
 *       .use(masterSelector())
 *
 *   This middleware is used on the hosting site and sets the instance to be the
 *   master. This allows us to use the popit object for the utility functions as
 *   we normally would. 
 *
 *   For the instance sites you should use 'instanceSelector'
 *
 * @return {Function}
 * @api public
 */

module.exports = function masterSelector () {

    return function vhost(req, res, next){
        
        // Create a new popit object and assign it to the master database
        var popit = new PopIt();
        popit.set_as_master();
        req.popit = popit;
        res.local( 'popit', popit );

        next();

    };
};