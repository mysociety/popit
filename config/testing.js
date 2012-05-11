module.exports = {

    server: {
        port: 3100,
    },

    hosting_server: {
        host:       'www.127-0-0-1.org.uk',
        base_url:   'http://www.127-0-0-1.org.uk:3100',
    },

    instance_server: {
        base_url_format: "http://%s.127-0-0-1.org.uk:3100",
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
