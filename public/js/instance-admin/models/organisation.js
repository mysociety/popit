define( [ 'Backbone' ], function ( Backbone  ) {

  return Backbone.Model.extend({
    urlRoot: '/api/v1/organisation',
    schema: {
      name: { dataType: 'Text', validators: ['required'] },
      slug: { dataType: 'Text', validators: ['required'] },
    }
  });

});