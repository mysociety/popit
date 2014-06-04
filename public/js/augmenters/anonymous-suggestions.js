// ------------------------
//  When anonymous users click one of the "edit" links on a person/org page,
//  they are shown a modal window that tells them to log in or suggest an edit.
// ------------------------

require(['jquery', 'jquery.fancybox'], function($) {
  "use strict";

  $(function() {

    var isAnonymous = ! $('body').is('.signed_in');

    $('.entity-enter-edit-mode').on('click', function(){
      if (isAnonymous) {

        // :TODO: this might be useful to put in the email, so the
        // instance owner knows what field the suggestion is for.
        var inputSelector = $(this).attr('data-input-selector');

        var submitButtonPressed = function(){
          $(this).attr('disabled', true).html('Sending suggestion&hellip;');
          // :TODO: this is just me simulating the delay of a POST to the server.
          setTimeout(suggestionSubmitted, 1000);
        }

        var suggestionSubmitted = function(){
          $div.html('<h2>Thanks for your suggestion!</h2>');
          $div.append('<p>It has been emailed to the instance owner.</p>');
          setTimeout($.fancybox.close, 3000);
        }

        var $div = $('<div class="entity-suggestion">');
        $div.append('<h2>Hello stranger!</h2>');
        $div.append('<p>If you have an account, <a href="/login">please log in</a> to make this change.</p>');
        $div.append('<hr>');
        $div.append('<p><label for="suggestion">Or, suggest an edit, anonymously:</label></p>');
        $div.append('<p><textarea class="form-control" id="suggestion"></textarea></p>');
        $div.append('<p><button class="btn btn-primary">Send suggestion</button></p>');

        $div.on('click', 'button', submitButtonPressed);

        $.fancybox({ content: $div });

      }
    });

  });

});
