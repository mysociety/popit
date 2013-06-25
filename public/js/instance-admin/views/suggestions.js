define(
  [
    'Backbone',
    'underscore',
    'instance-admin/collections/suggestions',
    'text!templates/suggestions/compact_list.html'
  ],
  function(
    Backbone,
    _,
    SuggestionsCollection,
    listTemplate
   ) {
     "use strict"; 

    var SuggestionsView = Backbone.View.extend({
      tagName:   'ul',
      className: 'suggestions',
      collection: new SuggestionsCollection(),

      listTemplate: _.template( listTemplate ),

      render: function () {
        var content = this.listTemplate({ url_type: this.options.url_type, items: this.collection.toJSON() });
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

  }
);
