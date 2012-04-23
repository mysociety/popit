$(document).ready(function() {
	
	
	/*
		Enlarge and shrink the search box on focus
	*/
	$('#person-search').focus(function(event) {
		$('.person-header-nav').addClass('focus-search');
	}).blur(function(event) {
		$('.person-header-nav').removeClass('focus-search');
	});
	

	/*
		Design State Demos 
		- the different sized headers, toggle by clicking on logo
	*/ 
	$('.logo').click(function(e) { $('body').toggleClass('brand_page'); });
	
});
