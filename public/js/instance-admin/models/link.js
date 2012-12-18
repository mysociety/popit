define( [ 'Backbone' ], function ( Backbone  ) {
  "use strict"; 

  return Backbone.Model.extend({
    idAttribute: "id",
    schema: {
      url: {
        dataType:   'Text',
        validators: ['required']
      },
      comment: {
        dataType:            'Text',
        validators:          ['required'],
        autocomplete_source: '/autocomplete/link_comment'
      }
    }
  });


});
