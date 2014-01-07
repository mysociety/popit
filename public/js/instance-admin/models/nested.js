define( [ 'Backbone' ],
function ( Backbone ) {
  "use strict"; 

  var NestedModel = Backbone.Model.extend({
    nest: function(key, Collection, attrs) {
      if (!attrs[key]) {
        return;
      }
      if (this[key]) {
        this[key].reset( attrs[key] );
      } else {
        this[key] = new Collection( attrs[key] );
        this[key].on('add change remove', function(){ this.save(); }, this);
      }
      attrs[key] = this[key];
    }
  });

  return NestedModel;

});
