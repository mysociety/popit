// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

define(
  [
    'jquery',
    'instance-admin/app',
    'instance-admin/models/person',
    'instance-admin/views/person-new',
    'instance-admin/views/person-remove',
    'jquery.fancybox'
  ],
  function (
    $,
    App,
    PersonModel,
    PersonNewView,
    PersonRemoveView
  ) {

    App.addInitializer(function(options){

      $('a.new-person').click(function(event) {

        event.preventDefault();

        var person = new PersonModel({});
        var view   = new PersonNewView({model: person});
        
        // render in lightbox, focus on first input
        $.fancybox( view.render().el );
        view.$(':input:first').focus();
      });
      
      $('a.delete-person').click(function(event) {

        var $link = $(this);
        event.preventDefault();

        var person = new PersonModel({
          id: $link.attr('data-id')
        });

        person.fetch({
          success: function (model, response) {
            var view   = new PersonRemoveView({model: model});
            $.fancybox( view.render().el );            
          }
        });
        
      });
      
    });
  }
);
