$(document).ready(function() {
	
	// ------------------------
	//  Replace spaces in h1 with nbsp. FIXME can we do this server side
	// ------------------------
	var h1_person_name = $('.person-header-nav h1').text();
	h1_person_name = h1_person_name.replace(/ /i, ' ');
	$('.person-header-nav h1').text(h1_person_name);
	
	
	
	
	
	// ------------------------
	//  Enlarge and shrink the search box on focus
	// ------------------------
	$('#person-search').focus(function(event) {
		$('.person-header-nav').addClass('focus-search');
	}).blur(function(event) {
		$('.person-header-nav').removeClass('focus-search');
	});
	
	
	
	// ------------------------
	// Instance Name Validation
	// ------------------------
	$('#slug').keypress(function(e) {
		
		/* FIXME EVDB check this is the best way to do this and also to match with serverside checks */
		var check_allowed_letter = function(ltr){
			if(
				(ltr >= 97 && ltr <= 122) // a-z
				||
				(ltr >= 65 && ltr <= 90) // A-Z
				||
				(ltr >= 48 && ltr <= 57) // 0-9
				||
				(ltr === 45 || ltr === 95) // - _
			){
				return true;
			} else{
				return false;
			}
		}
		// Return True/False to prevent or allow the key being pressed
		// or add an error class to display the hint when a disallowed key is pressed
		return check_allowed_letter(e.keyCode);
	}).change(function(e) {
		// Check pasted text
		var changedText = $(this).val();
		var cleanedText = changedText.replace(/[^a-z0-9_\-]/gi, '-').toLowerCase();
		$(this).val(cleanedText);
	});
	
	
	// ------------------------
	// Email Validation / Mailcheck
	// ------------------------
	var email_suggestion_box = $('.suggestion');
	email_suggestion_box.hide();
	var domains = ['hotmail.com', 'gmail.com', 'aol.com', 'mysociety.org'];
	$('#email').on('blur', function() {
		$(this).mailcheck({
			domains: domains,   // optional
			suggested: function(element, suggestion) {
				email_suggestion_box.html(' Did you mean <strong>'+suggestion.full+'</strong>').slideDown();
			},
			empty: function(element) {
				email_suggestion_box.slideUp().html('');
			}
		});
	});
	
});
