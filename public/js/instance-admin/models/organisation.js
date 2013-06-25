define( [ 'Backbone', 'underscore' ], function ( Backbone, _ ) {
  "use strict"; 

  return Backbone.Model.extend({
    urlRoot: '/api/v0.1/organizations',

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

});
