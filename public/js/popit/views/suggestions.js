define(
  [
    'Backbone',
    'templates/person/compact_list'
  ],
  function(
    Backbone,
    compactListTemplate
   ) {

  var SuggestionsView = Backbone.View.extend({
    tagName:   'ul',
    className: 'suggestions',

    initialize: function() {
      var self = this;
      this.collection.bind("reset", function() { self.render() } );
    },

    render: function () {
      var content = compactListTemplate({ persons: this.collection.toJSON() });
      this.$el.html( content );
      return this;
    }
  });

  return SuggestionsView;

});