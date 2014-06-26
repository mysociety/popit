/*global alert:false */
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

        var inputText = $(this).text();
        var $div = $('<div class="entity-suggestion">');

        var submitButtonPressed = function(){
          $(this).attr('disabled', true).html('Sending suggestion&hellip;');
          $.ajax({
            url: '/suggestion',
            type: 'POST',
            data: {
              field: $.trim(inputText),
              suggestion: $div.find('#suggestion').val(),
              url: window.location.toString()
            },
            success: suggestionSubmitted,
            error: function() {
              $div.find('button').attr('disabled', false).html('Send suggestion');
              alert("There was a problem sending your message, please try again later");
            }
          });
        };

        var suggestionSubmitted = function(){
          $div.html('<h2>Thanks for your suggestion!</h2>');
          $div.append('<p>It has been emailed to the instance owner.</p>');
          setTimeout($.fancybox.close, 3000);
        };

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
