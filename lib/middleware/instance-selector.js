"use strict"; 

var config      = require('config'),
    PopIt       = require('../popit'),
    utils       = require('../utils');

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

    var site_not_found = function (res) {
        // If no site found then render the no site 404 page
        res.render( 'errors/no_site_found', {status: 404} );
    };

    var master = new PopIt();
    master.set_as_master();
    
    return function select_instance(req, res, next){
        
        // Look at the config to see if there is an instance override in place.
        // This can be used on single instance installs to skip all the messy
        // hostname lookups that are needed.
                
        // parse the host to see if it is a plain wild-carded address
        var suffix = config.instance_server.domain_suffix;
        var slug   = utils.extract_slug( req.headers.host, suffix );

        // No slug, no site
        if ( ! slug) 
            site_not_found(res);

        // TODO: if site exists but is not active show a special error message rather than just 404ing

        master.model('Instance').findOne(
            { slug: slug, status: 'active' },
            function (err, instance) {
                if (err) throw err;
                
                if ( instance ) {
                    var popit = new PopIt();
                    popit.set_instance( instance.slug );
                    popit.load_settings(function(error){
                      if ( error ) throw error;
                      req.popit = popit;
                      res.local('popit', popit);
                      next();
                    });
                } else {
                    site_not_found(res);
                }
            }
        );
        
        // Future additions...

        // have a custom domain - look it up in the database
        
        // log the access somehow? Possibly easier to do from the logs as a cron job

    };
};




