/*  Configuration file
 *
 *
 *
 */

module.exports = {

    hosting_server: {
        port:   3100,
        domain: 'www.vcap.me:3100',
    },

    instance_server: {
        port:          3101,
        domain_suffix: 'vcap.me:3101',
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
