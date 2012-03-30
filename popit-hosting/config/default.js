/*  Configuration file
 *
 *
 *
 */

module.exports = {
    MongoDB: {
        host: 'localhost',
        port: 27017,
        name: 'all',
        prefix: 'popit_',
    },
    email: {
        transport:         'Sendmail',
        transport_options: { },
        send_by_transport: true,
        save_to_database:  false,
        print_to_console:  false,
    }
};
