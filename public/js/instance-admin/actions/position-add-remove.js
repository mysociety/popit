// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-position button
// ------------------------

define(
  [
    'jquery',
    'instance-admin/app',
    'instance-admin/models/position',
    'instance-admin/views/position-new',
    // 'instance-admin/views/position-remove',
    'jquery.fancybox'
  ],
  function (
    $,
    App,
    PositionModel,
    PositionNewView,
    PositionRemoveView
  ) {

    App.addInitializer(function(options){

      $('a.new-position').click(function(event) {

        event.preventDefault();

        // Add in grabbing the person or organisation from details in the link.

        var position = new PositionModel({});
        var view     = new PositionNewView({model: position});
        
        // render in lightbox, focus on first input
        $.fancybox( view.render().el );
        view.$(':input:first').focus();
      });
      
      // $('a.delete-position').click(function(event) {
      // 
      //   var $link = $(this);
      //   event.preventDefault();
      // 
      //   var position = new PositionModel({
      //     id: $link.attr('data-id')
      //   });
      // 
      //   position.fetch({
      //     success: function (model, response) {
      //       var view   = new PositionRemoveView({model: model});
      //       $.fancybox( view.render().el );            
      //     }
      //   });
      //   
      // });
      
    });
  }
);
