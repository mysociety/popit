define( [ 'Backbone', 'underscore',
    'instance-admin/collections/contacts',
    'instance-admin/collections/links'
],
function ( Backbone, _, ContactCollection, LinkCollection ) {
  "use strict"; 

  var PersonModel = Backbone.Model.extend({
    urlRoot: '/api/v0.1/persons',

    nest: function(key, Collection, attrs) {
      if (this[key]) {
        this[key].reset( attrs[key] );
      } else {
        this[key] = new Collection( attrs[key] );
        this[key].on('add change remove', function(){ this.save(); }, this);
      }
      attrs[key] = this[key];
    },

    set: function(attrs, options) {
      this.nest('links', LinkCollection, attrs);
      this.nest('contact_details', ContactCollection, attrs);
      return Backbone.Model.prototype.set.call(this, attrs, options);
    },

    initialize: function() {
      Backbone.on('in-place-edit', this.inPlaceEdited, this);
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
