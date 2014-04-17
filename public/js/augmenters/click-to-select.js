// ------------------------
//  Select all the text in an <input> on focus.
//  And disable edits to the <input> content.
// ------------------------

require(['jquery'], function($) {
  "use strict";

  $(function() {

    $('input.click-to-select').on('click', function(event) {
      event.preventDefault();
      $(this).select();
    }).attr('readonly', 'readonly');

  });
});
