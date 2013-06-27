define( [ 'Backbone', 'instance-admin/models/link' ], function ( Backbone, LinkModel ) {
  "use strict";

  var LinkCollection = Backbone.Collection.extend({
    model: LinkModel
  });

  return LinkCollection;

});
