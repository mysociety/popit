define( [ 'Backbone' ], function ( Backbone  ) {
  "use strict"; 

  return Backbone.Model.extend({
    schema: {
      label: { dataType: 'Text', validators: ['required'] },
      role: { dataType: 'Text' }
    }
  });

});
