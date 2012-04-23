/*  Configuration file
 *
 *
 *
 */

module.exports = {
    hosting_server: {
        domain:     'popit.example.com',
    },
    instance_server: {
        domain_suffix: 'popit.example.com',
        cookie_secret: 'something-really-secret',
    },
    email: {
        transport:         'SMTP',
        // See https://github.com/andris9/Nodemailer for config - empty fine for localhost:25
        transport_options: { },
    },
    
};
