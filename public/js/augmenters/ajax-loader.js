// ------------------------

// Show and hide the spinning icon when ajax events start and finish. This is as
// much to let the user know something is happening as it is to give the test
// suite something to wait on.

// ------------------------

require(['jquery'], function($) {
  "use strict"; 

  $(document).ready(function() {

    $('#ajax-loader')
      .ajaxStart(function() {
        $(this).show();
      })
      .ajaxStop(function() {
        $(this).hide();
      });

  });
});
