define( [ 'Backbone', 'instance-admin/models/membership' ], function ( Backbone, MembershipModel ) {
  "use strict";

  var MembershipCollection = Backbone.Collection.extend({
    url: '/api/v0.1/memberships',
    model: MembershipModel
  });

  return MembershipCollection;

});
