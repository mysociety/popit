var config      = require('config'),
    PopIt       = require('../popit');

/**
 * Instance Selector:
 * 
 *   Work out which instance to serve from the config or the request host.
 *
 *     connect()
 *       .use(instanceSelector())
 *
 *   This middleware is used on the instance sites to detemine which instance
 *   it is meant to be serving. It adds a popit attribute to the request that
 *   can then be used to get database handles, send email etc.
 *
 *   For the hosting site you should use 'masterSelector'
 *
 * @return {Function}
 * @api public
 */

module.exports = function instanceSelector () {

    return function vhost(req, res, next){
        
        var popit = new PopIt();

        // Look at the config to see if there is an instance override in place.
        // This can be used on single instance installs to skip all the messy
        // hostname lookups that are needed.
                
        // parse the host to see if it is a plain wild-carded address

        // have a custom domain - look it up in the database
        
        // log the access somehow? Possibly easier to do from the logs as a cron job


        // Old code that was copied from middleware this is based on (connect.vhost)
        //
        // if (!req.headers.host) return next();
        // var host = req.headers.host.split(':')[0];
        // if (!regexp.test(host)) return next();
        // if ('function' == typeof server) return server(req, res, next);

        next();
    };
};