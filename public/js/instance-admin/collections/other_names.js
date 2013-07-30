define( [ 'Backbone', 'instance-admin/models/other_name' ], function ( Backbone, OtherNameModel ) {
  "use strict";

  var OtherNamesCollection = Backbone.Collection.extend({
    model: OtherNameModel
  });

  return OtherNamesCollection;

});
