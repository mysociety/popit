define( [ 'Backbone' ], function ( Backbone  ) {

  var SuggestionsCollection = Backbone.Collection.extend({
    url: '/api/v1/person'
  });

  return SuggestionsCollection;

});