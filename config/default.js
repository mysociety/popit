/*  Configuration file
 *
 *
 *
 */

module.exports = {
    hosting_server: {
        port: 3000,
    },
    MongoDB: {
        name:            'all',
        host:         'localhost',
        port:         27017,
        popit_prefix: 'popit_',
        
    },
    email: {
        transport:         'Sendmail',
        transport_options: { },
        send_by_transport: true,
        save_to_database:  false,
        print_to_console:  false,
    }
};
