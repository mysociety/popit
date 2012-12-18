define( [ 'Backbone' ], function ( Backbone  ) {
  "use strict"; 

  var ContactModel = Backbone.Model.extend({
    idAttribute: "id",
    schema: {
      kind: {
        dataType:            'Text',
        validators:          ['required'],
        autocomplete_source: '/autocomplete/contact_kind'
      },
      value: {
        dataType:   'Text',
        validators: ['required']
      }
    }
  });

  return ContactModel;

});
