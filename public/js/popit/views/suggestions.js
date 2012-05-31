define(
  [
    'Backbone',
    'popit/collections/suggestions',
    'templates/person/compact_list'
  ],
  function(
    Backbone,
    SuggestionsCollection,
    compactListTemplate
   ) {

  var SuggestionsView = Backbone.View.extend({
    tagName:   'ul',
    className: 'suggestions',
    collection: new SuggestionsCollection(),

    render: function () {
      var content = compactListTemplate({ persons: this.collection.toJSON() });
      this.$el.html( content );
      return this;
    },
    
    setName: function (name) {
      var self = this;

      if (name) {
        self.collection.fetch({
          data: { name: name },
          success: function () {
            self.render();
          }
        });          
      } else {
        self.collection.reset();
        self.render();
      }
      
      return self;
    }

  });

  return SuggestionsView;

});