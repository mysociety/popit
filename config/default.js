var path = require('path');

module.exports = {

    // by default use the compressed assets - this will apply to the test suite 
    // too
    public_dir: 'public-production',
    docs_dir:   path.normalize(__dirname + '/../docs'),

    show_dev_site_warning: false,

    server: {
      port: 3000,
    },

    logging: {
      log_to_file:    true,
      log_to_console: false,
      log_level:      'info',
      log_directory:  path.normalize(__dirname + '/../../popit_logs'),
    },

    image_proxy: {
        path:       '/image-proxy/',
    },

    hosting_server: {
      // *.127.0.0.1.xip.io points to 127.0.0.1
        host:       'www.127.0.0.1.xip.io',
        base_url:   'http://www.127.0.0.1.xip.io:3000',
        email_from: 'PopIt <popit@mysociety.org>', 

        // This is a token asked for on the un-publicised create new instance page. It
        // is a simple way to let only invited people create instances.
        create_instance_invite_code: "Open Sesame",
    },
    instance_server: {
        // This is used to create the url to the instance site. '%s' is
        // replaced with the instance name.
        base_url_format: "http://%s.127.0.0.1.xip.io:3000",
        cookie_secret: 'hurgleflurdle',
        files_dir:     path.normalize(__dirname + '/../../popit_files'),
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
        bcc_to_sender:     true,
    },
    
    // default settings used if a site has not overidden them
    default_settings: {

        // used if instance owners do not set an email address
        email_from: 'DO NOT REPLY <popit@mysociety.org>',
    },
    
};
     
