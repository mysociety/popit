
// Thin wrapper around nodemailer, with option to save mails to database
var nodemailer   = require('nodemailer'),
    email_config = require('config').email;



module.exports = {

    transport: nodemailer.createTransport(
        email_config.transport,
    
        // hack to turn the config into a datastructure
        JSON.parse( JSON.stringify( email_config.transport_options || {} ) )
    ),

    send_by_transport: email_config.send_by_transport,
    save_to_database:  email_config.save_to_database,
    print_to_console:  email_config.print_to_console,


    // send an email
    send: function ( req, message ) {

        if ( this.print_to_console )
            console.log( message );

        if ( this.send_by_transport )
            this.transport.sendMail( message, function (err, responseStatus) {
                if ( err ) console.log( err );
            } );
        
        if ( this.save_to_database ) {
            console.log( 'FIXME - save to database here' );
        }
               
    },
    
};