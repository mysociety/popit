// Allows for fields to be edited inline, rather than by using a form.
// 
// Is activated by setting one of these classes on the element:
// 
//   edit-in-place
//   edit-in-place-textarea
// 
// Options are specified using the 'data-' attributes:
// 
//   data-api-url:  the API endpoint that the changes should be PUT to - does not include the leading '/api/v1' bit.
//   data-api.name: what is this field called.
// 
// This is only suitable for single field changes, for more complicated editing
// (multi field, constraints, etc) something more involved should be used.

require(
  ['jquery', 'jquery.jeditable'],
  function ($) {

    "use strict";

    var apiPrefix = '/api/v1';
  
    function onSubmit (value, settings) { 
  
      var element = $(this);
      
      var apiUrl  = apiPrefix + element.attr('data-api-url');
      var apiName = element.attr('data-api-name');
  
      var submitData = {};
      submitData[apiName] = value;
      
      $.ajax({
        url:  apiUrl,
        type: 'PUT', // TODO - perhaps we should be less proper and use the method_override?
        data: submitData,
        success: function () {
          // TODO - report success to the user.
        },
        error: function () {
          // TODO - handle this using some way to alert the user other than a modal dialog 
          alert("There was an error sending your changes to the server - please refresh the page and try again.");
        }
      });
  
      return(value);
    }
  
    $( function() {
      
      // We only want the editing to be enabled for users who are signed in
      var $signed_in = $('body.signed_in');

      $signed_in.find('.edit-in-place'         ).editable( onSubmit, {} );

      $signed_in.find('.edit-in-place-textarea').editable( onSubmit, {
        type: 'textarea',
        submit: 'OK',    // return does not work in a textarea
        onblur: 'ignore' // otherwise tabbing to the submit cancels the edit. Doh!
      });


      // we also have links to the inplace edits - so that touch srceen users have
      // some form of discovery. These links should just trigger the above clicks. The
      // element that is clicked to trigger this event should give pass the id of the
      // editable elemente to trigger using the attribute 'data-edit-in-place-id'.
      $signed_in.find('.activate-edit-in-place').click(function(e) {
        e.preventDefault();
        var id = $(this).attr('data-edit-in-place-id');
        $('#' + id).click();
      });


    });
  
  }
);
