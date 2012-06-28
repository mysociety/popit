define(
  [
    'Backbone',
    'underscore',
    'popit/collections/suggestions',
    'templates/person/compact_list'
  ],
  function(
    Backbone,
    _,
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
    
    setName: _.debounce(
      function (name) {
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
      },
      200 // delay 200 ms before requesting the name from the server
    )

  });

  return SuggestionsView;

});