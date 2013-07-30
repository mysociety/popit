define( [ 'Backbone' ], function ( Backbone ) {
  "use strict";

  var IdentifierModel = Backbone.Model.extend({
    schema: {
      identifier: { dataType: 'Text', validators: [ 'required' ] },
      scheme: {
        dataType: 'Text',
        autocomplete_source: '/autocomplete/identifier_scheme'
      }
    }
  });

  return IdentifierModel;

});
