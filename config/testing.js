module.exports = {

    // Don't use minified assets - makes dev easier as no js rebuild required
    public_dir: 'public',

    // show the worning on the web pages
    show_dev_site_warning: true,

    // If you change this you will also need to change it in
    // tests/test-server-start.bash
    server: {
        port: 3100,
    },

    // log to the console, and log more
    logging: {
      log_level:      'info',
    },

    hosting_server: {
        host:       'www.127.0.0.1.xip.io',
        base_url:   'http://www.127.0.0.1.xip.io:3100',
    },

    instance_server: {
        base_url_format: "http://%s.127.0.0.1.xip.io:3100",
        files_dir:     '/tmp/popit_files',
    },
    
    MongoDB: {
        popit_prefix: 'popittest_',
    },
    
    email: {
        send_by_transport: false,
        save_to_database:  true,
    },

    // set this so that we can check that the testing config has been loaded
    testing_config_loaded: true,

    default_settings: {
        default_test_key: 'default test value',
    },

};
