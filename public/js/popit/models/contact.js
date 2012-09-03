define( [ 'Backbone' ], function ( Backbone  ) {

  var ContactModel = Backbone.Model.extend({
    idAttribute: "_id",
    schema: {
      kind: {
        dataType:            'Text',
        validators:          ['required'],
        autocomplete_source: '/autocomplete/contact_kind'
      },
      value: {
        dataType:   'Text',
        validators: ['required']
      },
    }
  });

  return ContactModel;

});
