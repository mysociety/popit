// ------------------------
//  Submit the parent form when the enter key is pressed in a text input
// ------------------------

require(['jquery'], function($) {
  "use strict";

  $(function() {

    $(document).on('keyup', 'input[type="text"]', function(event) {
      if (event.keyCode == 13) {
        $('.entity-save-new, .entity-save-changes').trigger('click');
      }
    });

  });

});
