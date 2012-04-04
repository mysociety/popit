/*  Configuration file
 *
 *
 *
 */

module.exports = {

    hosting_server: {
        port: 3001,
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
