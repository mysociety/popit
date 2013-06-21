define( [ 'Backbone' ], function ( Backbone  ) {
  "use strict"; 

  var PersonModel = Backbone.Model.extend({
    urlRoot: '/api/v0.1/persons',
    schema: {
      name: { dataType: 'Text', validators: ['required'] },
      slug: { dataType: 'Text', validators: ['required'] }
    }
  });

  return PersonModel;

});
