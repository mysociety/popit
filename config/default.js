/*  Configuration file
 *
 *
 *
 */

module.exports = {
    hosting_server: {
        port:       3000,
        domain:     'www.vcap.me:3000',  // *.vcap.me points to 127.0.0.1
        email_from: 'PopIt <popit@mysociety.org>', 
    },
    instance_server: {
        port:          3001,
        domain_suffix: 'vcap.me:3001',
        cookie_secret: 'hurgleflurdle',
    },
    MongoDB: {
        host:         'localhost',
        port:         27017,
        master_name:  '_master',
        session_name: '_session',
        popit_prefix: 'popit_',        
    },
    email: {
        transport:         'Sendmail',
        transport_options: { },
        send_by_transport: true,
        save_to_database:  false,
        print_to_console:  false,
    },
    
    // default settings used if a site has not overidden them
    default_settings: {

        // used if instance owners do not set an email address
        email_from: 'DO NOT REPLY <popit@mysociety.org>',
    },
    
};
