// Allows for fields to be edited inline, rather than by using a form.
// 
// Is activated by setting one of these classes on the element:
// 
//   edit-in-place
//   edit-in-place-textarea
// 
// Options are specified using the 'data-' attributes:
// 
//   data-api-url:  the API endpoint that the changes should be PUT to.
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
          // FIXME - report success to the user.
        },
        error: function () {
          // FIXME - handle this using some way to alert the user other than a modal dialog 
          alert("There was an error sending your changes to the server - please refresh the page and try again.");
        }
      });
  
      return(value);
    }
  
    $( function() {
      $('.edit-in-place'         ).editable( onSubmit, {} );
      $('.edit-in-place-textarea').editable( onSubmit, {
        type: 'textarea',
        submit: 'OK',    // return does not work in a textarea
        onblur: 'ignore' // otherwise tabbing to the submit cancels the edit. Doh!
      });
    });
  
  }
);
