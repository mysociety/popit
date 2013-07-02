define( [ 'Backbone' ], function ( Backbone  ) {
  "use strict"; 

  return Backbone.Model.extend({
    urlRoot: '/api/v0.1/memberships'
  });

});
