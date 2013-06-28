define( [ 'Backbone', 'instance-admin/models/post' ], function ( Backbone, PostModel ) {
  "use strict";

  var PostCollection = Backbone.Collection.extend({
    url: '/api/v0.1/posts',
    model: PostModel
  });

  return PostCollection;

});
