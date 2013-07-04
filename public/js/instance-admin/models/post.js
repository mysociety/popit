define( [ 'Backbone' ], function ( Backbone  ) {
  "use strict"; 

  return Backbone.Model.extend({
    urlRoot: '/api/v0.1/posts',
    schema: {
      label: { dataType: 'Text', validators: ['required'] },
      role: { dataType: 'Text' },
      area: {
        type: 'Object', subSchema: {
          id: {},
          name: {}
        }
      }
    }
  });

});
