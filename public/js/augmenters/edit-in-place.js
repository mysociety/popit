
"use strict";

require(['jquery', 'jquery.jeditable'], function ($) {

  var apiPrefix = '/api/v1'

  function onSubmit (value, settings) { 

    var element = $( this );
    
    var apiUrl  = apiPrefix + element.attr('data-api-url');
    var apiName = element.attr('data-api-name');

    var submitData = {};
    submitData[apiName] = value;
    
    $.ajax({
      url:  apiUrl,
      type: 'PUT', // TODO - perhaps we should be less proper and use the method_override?
      data: submitData,
      success: function () {
        console.log('good');
      },
      error: function () {
        console.log('error');        
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

});
