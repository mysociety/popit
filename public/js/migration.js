// ------------------------
// Migration page
// ------------------------
//

"use strict";

require(['order!jquery'], function ($) {
  $(function() {

    $('select').change(function() {
      var suggestions;
      var s = $(this).find(":selected").filter('option[data-suggestions]').attr('data-suggestions');
      
      if (s) {
        suggestions = eval(s).join(", ")
      } else {
        suggestions = ''
      }
      
      $(this).parents('tr').find('.suggestions').html(suggestions);
    });

    $('form').submit(function() {
      // TODO validation
    });

    // initialize
    $('select').change();

  }); 
});
