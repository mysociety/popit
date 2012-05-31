// ------------------------
// Email Validation / Mailcheck
// ------------------------
//
// uses https://github.com/Kicksend/mailcheck
//
// Any input of type 'email' will have this added to it.
//
// TODO: nicer trainsitions in and out of the suggestion box. As it is created
// on demand I suspect that it has no height, which confuses the slideDown. Best
// would be to use a floating tootip or something...
//
// TODO: make the suggested email clickable to put the email into the form
// field.

"use strict";

require(['order!jquery', 'order!jquery.mailcheck'], function ($) {
  var domains = [
    // These are the default domains that ship with the plugin
    'yahoo.com', 'google.com', 'hotmail.com', 'gmail.com', 'me.com', 
    'aol.com', 'mac.com', 'live.com', 'comcast.net', 'googlemail.com', 
    'msn.com', 'hotmail.co.uk', 'yahoo.co.uk', 'facebook.com', 'verizon.net', 
    'sbcglobal.net', 'att.net', 'gmx.com', 'mail.com',

    // These are extra domains we wish to add
    'mysociety.org'
  ];

  $(document).on('change', 'input[type=email]', function() {

    // capture the input field that triggered the event
    var $input      = $(this),
        $suggestion = $input.next('.suggestion');

    if (!$suggestion) {
      $suggestion = $('<div class="suggestion" />');
      $input.after($suggestion).hide();
    }

    $input.mailcheck({
      domains: domains,   // optional
      suggested: function (element, suggestion) {
        var message = 'Did you mean <strong>' + suggestion.full + '</strong>?';          
        $suggestion.html(message).slideDown();
      },
      empty: function (element) {
        $suggestion.slideUp();
      }
    });

  });

});
