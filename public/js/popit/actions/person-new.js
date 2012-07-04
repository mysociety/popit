// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

define(
  [
    'jquery',
    'popit/app',
    'popit/models/person',
    'popit/views/person-new',
    'jquery.fancybox',    
  ],
  function (
    $,
    App,
    PersonModel,
    PersonNewView
  ) {

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
  }
);
