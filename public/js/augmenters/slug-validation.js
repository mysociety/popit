// ------------------------
// Slug Validation
// ------------------------

require( [ 'jquery', 'utils/slugify' ],
  function( $,        slugify  ) {

  var check_allowed_letter = function(ltr){
		if (
         (ltr >= 97 && ltr <= 122) // a-z
      || (ltr >= 65 && ltr <= 90)  // A-Z
      || (ltr >= 48 && ltr <= 57)  // 0-9
      || (ltr === 45)              // -
      || (ltr === 32)              // space - let it through and then let thu slugify code convert them into dashes
      || ($.inArray(ltr, [13, 37, 39, 9, 20, 46, 8]) >= 0) // Special keys, http://mikemurko.com/general/jquery-keycode-cheatsheet/
		) {
			return true;
		} else {
			return false;
		}
	}

	$(document).on(
	  {
	    keypress: function(e) {

        // .which  seems to return 0 for some keys in firefox - like the arrow keys. If
        // we don't get a response from which fall back to .keyCode
        var key = e.which || e.keyCode;
        
	      // Return True/False to prevent or allow the key being pressed or add an 
	      // error class to display the hint when a disallowed key is pressed
	      return check_allowed_letter( key );
	    },
	    change: function(e) {
      	// Check pasted text
      	var changedText = $(this).val();
      	var cleanedText = slugify( changedText );
      	$(this).val(cleanedText);
      }
    },
    'input[name=slug]'
  );

});



