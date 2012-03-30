/*  Configuration file
 *
 *
 *
 */

module.exports = {
    MongoDB: {
        prefix: 'popittest_',
    },
    
    email: {
        send_by_transport: false,
        save_to_database:  true,
    },

    // set this so that we can check that the testing config has been loaded
    testing_config_loaded: true,

};
