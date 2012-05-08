// ------------------------
// Slug Validation
// ------------------------

require(['jquery'], function($) {

	/* FIXME EVDB check this is the best way to do this and also to match with serverside checks */
	var check_allowed_letter = function(ltr){
		if(
			(ltr >= 97 && ltr <= 122) // a-z
			||
			(ltr >= 65 && ltr <= 90) // A-Z
			||
			(ltr >= 48 && ltr <= 57) // 0-9
			||
			(ltr === 45) // _
		){
			return true;
		} else{
			return false;
		}
	}

	$(document).on(
	  {
	    keypress: function(e) {
	      // Return True/False to prevent or allow the key being pressed or add an 
	      //error class to display the hint when a disallowed key is pressed
	      return check_allowed_letter(e.which);
	    },
	    change: function(e) {
      	// Check pasted text
      	var changedText = $(this).val();
      	var cleanedText = changedText.replace(/[^a-z0-9\-]+/gi, '-').toLowerCase();
      	$(this).val(cleanedText);
      }
    },
    'input[name=slug]'
  );

});



