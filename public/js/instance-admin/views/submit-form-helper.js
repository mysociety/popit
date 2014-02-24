/*

This is a standard submit for method that saves the data to the API and knows
how to display errors back to the user by adding them to the form.

*/

define(
  ['jquery', 'underscore'],
  function($,_) {
    "use strict"; 

    return function ( options ) {
    
      options = options || {};
      
      return function (e) {

        e.preventDefault();
        
        var self   = options.view || this;
        var form   = self.form;        
        
        
        var success_cb = options.success_cb || function (model, response) {
          document.location = '/' + options.type + '/' + response.id;
        };
    
    
        var error_cb = function (model, response) {
          
          var responseText = response.responseText;
          if (!responseText) return;        
          
          var errors = $.parseJSON( response.responseText ).errors || {};
          _.each(errors, function (val, key) {
            if (form.fields[key])
              form.fields[key].setError(val);
          });
    
        };
    
    
        var errors = form.commit();
    
    
        if (_.isEmpty(errors)) {

          if (options.pre_save_cb) {
            options.pre_save_cb();
          }

          self.model.save(
            {},
            {
              success: success_cb,
              error: error_cb
            }
          );
        }
    
      };
    };
  }
);
