
// Thin wrapper around nodemailer, with option to save mails to database
var nodemailer = require('nodemailer'),
    config     = require('config');



module.exports = {

    transport: nodemailer.createTransport(
        config.email.transport,
    
        // hack to turn the config into a datastructure
        JSON.parse( JSON.stringify( config.email.transport_options || {} ) )
    ),

    send_by_transport: config.email.send_by_transport,
    save_to_database:  config.email.save_to_database,
    print_to_console:  config.email.print_to_console,


    // send an email
    send: function ( req, message ) {
        var popit = req.popit;

        if ( popit.is_master ) {
            message['from'] = config.hosting_server.email_from;
        } else {
            message['from'] = popit.settings('email_from');            
        }
        
        if ( this.print_to_console )
            console.log( message );

        if ( this.send_by_transport )
            this.transport.sendMail( message, function (err, responseStatus) {
                if ( err ) console.log( err );
            } );
        
        if ( this.save_to_database ) {
            var Email = popit.model('Email');
            var email = new Email({
                message: message,
            });
            email.save();
        }
               
    },
    
};