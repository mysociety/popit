// ------------------------
//  When a close link (eg a flash message) is clicked find the first parent div
//  and hide it.
// ------------------------

require(['jquery'], function($) {
  $(document).ready(function() {

  	$('a.close').click( function(event) {
      event.preventDefault();
      $(this).closest('div').slideUp();
  	});

  });
});
