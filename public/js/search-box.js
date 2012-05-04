// ------------------------
//  Enlarge and shrink the search box on focus
// ------------------------

require(['jquery'], function($) {
  $(document).ready(function() {

  	$('#person-search').focus(function(event) {
  		$('.person-header-nav').addClass('focus-search');
  	}).blur(function(event) {
  		$('.person-header-nav').removeClass('focus-search');
  	});

  });
});
