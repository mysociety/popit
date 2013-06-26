define( [ 'Backbone' ], function ( Backbone  ) {
  "use strict"; 

  var ContactModel = Backbone.Model.extend({
    idAttribute: "_id",
    schema: {
      type: {
        dataType:            'Text',
        validators:          ['required'],
        autocomplete_source: '/autocomplete/contact_type'
      },
      value: {
        dataType:   'Text',
        validators: ['required']
      }
    }
  });

  return ContactModel;

});
