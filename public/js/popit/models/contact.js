define( [ 'Backbone' ], function ( Backbone  ) {

  var ContactModel = Backbone.Model.extend({
    // urlRoot: '/api/v1/person',
    schema: {
      kind:  { dataType: 'Text', validators: ['required'] },
      value: { dataType: 'Text', validators: ['required'] },
    }
  });

  return ContactModel;

});