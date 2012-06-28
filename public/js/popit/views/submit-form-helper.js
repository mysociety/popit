/*

This is a standard submit for method that saves the data to the API and knows
how to display errors back to the user by adding them to the form.

*/

define(
  [],
  function () {
    return function (e) {
      e.preventDefault();
      
      var self   = this;
      var form   = self.form;        
      var errors = form.commit();
      
      if (_.isEmpty(errors)) {
        this.model.save(
          {},
          {
            success: function (model, response) {
              document.location = response.meta.edit_url;
            },
            error: function (model, response) {
              var errors = $.parseJSON( response.responseText ).errors || {};
              _.each(errors, function(val, key) {
                if (form.fields[key])
                  form.fields[key].setError(val);
              });         
            }
          }
        );
      }

    };
  }
);
