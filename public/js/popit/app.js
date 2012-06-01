// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

define(
  [
    'jquery',
    'Backbone',
    'Backbone.Marionette',
    'popit/models/person',
    'popit/views/person-new'
  ],
  function (
    $,
    Backbone,
    BackboneMarionette,
    PersonModel,
    NewPersonView
  ) {

    // FIXME - this is in the wrong place, and we shouldn't be mucking around with the global jQuery behaviour like this.
    // handle the API wrapping the responses in result(s): {...}
    $.ajaxSetup({
      converters: {
        "text json": function (json) {
          var data = $.parseJSON(json);
          return data.results || data.result || data;
        }
      }
    });
    
    
    var App = new Backbone.Marionette.Application();

    App.addInitializer(function(options){

      $('#new-person').click(function(event) {

         event.preventDefault();

         var person = new PersonModel({});
         var view   = new NewPersonView({model: person});

         view.render();

         var $replacement = view.$el;
         $replacement.hide();
         $(this).hide().replaceWith( $replacement );
         $replacement.slideDown();

         view.$(':input:first').focus();
      });

    });
        
    return App;
  
  }
);
