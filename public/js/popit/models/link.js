define( [ 'Backbone' ], function ( Backbone  ) {

  return Backbone.Model.extend({
    idAttribute: "_id",
    schema: {
      url:     { dataType: 'Text', validators: ['required'] },
      comment: { dataType: 'Text', validators: ['required'] },
    }
  });


});