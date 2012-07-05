define( [ 'Backbone' ], function ( Backbone  ) {

  var ContactModel = Backbone.Model.extend({
    idAttribute: "_id",
    schema: {
      kind:  { dataType: 'Text', validators: ['required'] },
      value: { dataType: 'Text', validators: ['required'] },
    }
  });

  return ContactModel;

});