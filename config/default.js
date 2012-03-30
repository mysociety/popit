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
        host:         'localhost',
        port:         27017,
        master_name:  '_master',
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
