define( [ 'Backbone', 'instance-admin/models/contact' ], function ( Backbone, ContactModel ) {
  "use strict";

  var ContactCollection = Backbone.Collection.extend({
    model: ContactModel
  });

  return ContactCollection;

});
