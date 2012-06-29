// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

define(
  [
    'jquery',
    'jquery.fancybox',    
    'Backbone',
    'Backbone.Marionette',
    'popit/router',
    'popit/models/person',
    'popit/views/person-new'
  ],
  function (
    $,
    jQueryFancyBox,
    Backbone,
    BackboneMarionette,
    AppRouter,
    PersonModel,
    PersonNewView
  ) {

    // FIXME - this is in the wrong place, and we shouldn't be mucking around
    //         with the global jQuery behaviour like this.
    //
    // Handle the API wrapping the responses in result(s): {...}
    $.ajaxSetup({
      converters: {
        "text json": function (json) {
          var data = $.parseJSON(json);
          return data.results || data.result || data;
        }
      }
    });

    
    var App = new Backbone.Marionette.Application();


    App.addInitializer( function(options) {
      new AppRouter();
      Backbone.history.start({pushState: true});
    });
    

    App.addInitializer(function(options){

      $('#new-person').click(function(event) {

        event.preventDefault();

        var person = new PersonModel({});
        var view   = new PersonNewView({model: person});
        
        // render in lightbox, focus on first input
        $.fancybox( view.render().el );
 				view.$(':input:first').focus();
      });

    });
    
    App.addRegions({
      contentRegion: '#content'
    });
        
    return App;
  
  }
);
