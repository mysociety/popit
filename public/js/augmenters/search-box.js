// ------------------------
//  Enlarge and shrink the search box on focus
// ------------------------

require(['jquery'], function($) {
  "use strict"; 

  $(document).ready(function() {

    $('#entity-search').focus(function(event) {
      $('.entity-header-nav').addClass('focus-search');
    }).blur(function(event) {
      $('.entity-header-nav').removeClass('focus-search');
    });

  });
});
