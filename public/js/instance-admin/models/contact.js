define( [ 'Backbone' ], function ( Backbone  ) {
  "use strict"; 

  var ContactModel = Backbone.Model.extend({
    schema: {
      label: {},
      type: {
        dataType:            'Text',
        validators:          ['required'],
        autocomplete_source: '/autocomplete/contact_type'
      },
      value: {
        dataType:   'Text',
        validators: ['required']
      },
      note: {}
    }
  });

  return ContactModel;

});
