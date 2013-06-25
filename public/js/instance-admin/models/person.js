define( [ 'Backbone', 'underscore' ], function ( Backbone, _ ) {
  "use strict"; 

  var PersonModel = Backbone.Model.extend({
    urlRoot: '/api/v0.1/persons',

    initialize: function() {
      _.bindAll(this, 'inPlaceEdited');
      Backbone.on('in-place-edit', this.inPlaceEdited);
    },

    inPlaceEdited: function(chg) {
      this.save(chg);
    },

    schema: {
      name: { dataType: 'Text', validators: ['required'] },
      slug: { dataType: 'Text', validators: ['required'] }
    }
  });

  return PersonModel;

});
