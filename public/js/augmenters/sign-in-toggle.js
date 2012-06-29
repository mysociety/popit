// ------------------------
//  When a user hovers over the sign-in div show all the admin actions that
//  would be there if they did sign in
// ------------------------

require(['jquery'], function($) {
  $(function() {

    var $sign_in = $('#sign_in');
    var $body    = $('body');
    var signed_in_class = 'signed_in';

    // Only do the hover effect if we are not signed in
    if ( ! $sign_in.hasClass(signed_in_class) ) {
      $sign_in.hover(
        function(event) {
    		  $body.addClass(signed_in_class);
    	  },
    	  function(event) {
    		  $body.removeClass(signed_in_class);
    	  }
      );
    }

  });
});
