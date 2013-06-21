// Allows for fields to be edited inline, rather than by using a form.
// 
// Is activated by setting one of these classes on the element:
// 
//   edit-in-place
//   edit-in-place-textarea
// 
// Options are specified using the 'data-' attributes:
// 
//   data-api.name: what is this field called.
// 
// This is only suitable for single field changes, for more complicated editing
// (multi field, constraints, etc) something more involved should be used.

require(
  ['jquery', 'jquery.jeditable'],
  function ($) {
    "use strict";

    var onSubmit = function (value, settings) { 
  
      var element = $(this);
      
      var apiUrl  = element.attr('data-api-url');
      var apiName = element.attr('data-api-name');
  
      var submitData = {};
      submitData[apiName] = value;
      
      // XXX Update model here
  
      return(value);
    };
  
    $( function() {
      
      // We only want the editing to be enabled for users who are signed in
      var $signed_in = $('body.signed_in');

      $signed_in.find('.edit-in-place'         ).editable( onSubmit, {} );

      $signed_in.find('.edit-in-place-textarea').editable( onSubmit, {
        type: 'textarea',
        submit: 'OK',    // return does not work in a textarea
        onblur: 'ignore' // otherwise tabbing to the submit cancels the edit. Doh!
      });

    });
  
  }
);
