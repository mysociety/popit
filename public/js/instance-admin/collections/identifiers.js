define( [ 'Backbone', 'instance-admin/models/identifier' ], function ( Backbone, IdentifierModel ) {
  "use strict";

  var IdentifierCollection = Backbone.Collection.extend({
    model: IdentifierModel
  });

  return IdentifierCollection;

});
