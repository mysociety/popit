
// Thin wrapper around nodemailer, with option to save mails to database
var nodemailer = require('nodemailer'),
    config     = require('config'),
    winston    = require('winston'),
    _          = require('underscore');



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
            message.from = config.hosting_server.email_from;
        } else {
            message.from = popit.settings('email_from');            
        }

        // Should we send this email to ourselves
        if ( config.email.bcc_to_sender ) {
          message.bcc = message.from;
        }
        
        if ( this.print_to_console ) {
            winston.info( message );
        }

        if ( this.send_by_transport ) {
            var message_copy = _.extend( {}, message );
            this.transport.sendMail( message_copy, function (err, responseStatus) {
                if ( err ) {
                  winston.error("Issue sending email to transport.", message );
                  winston.error( err );
                }
            } );
        };
        
        if ( this.save_to_database ) {
            var Email = popit.model('Email');
            var email = new Email({
                message: message,
            });
            email.save(function(err) {
              if (err) {
                winston.error("Issue sending email to database.", message );
                winston.error(err);
              }
            });
        }
               
    },
    
};