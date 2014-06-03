// ------------------------
//  Submit the parent form when the enter key is pressed in a text input
// ------------------------

require(['jquery'], function($) {
  "use strict";

  $(function() {

    $(document).on('keyup', 'input[type="text"]', function(event) {
      if (event.keyCode == 13) {

        // Is the "add another" button visible?
        if( $('.entity-save-and-add-another').is(':visible') ){
          $('.entity-save-and-add-another').trigger('click');

        // Otherwise, click the normal save buttons.
        } else {
          $('.entity-save-new, .entity-save-changes').trigger('click');
        }
      }
    });

  });

});
