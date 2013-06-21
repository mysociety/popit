// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-position button
// ------------------------

define(
  [
    'jquery',
    'instance-admin/models/position',
    'instance-admin/views/position-new',
    // 'instance-admin/views/position-remove',
    'jquery.fancybox'
  ],
  function (
    $,
    PositionModel,
    PositionNewView
    //PositionRemoveView
  ) {
    "use strict"; 

    $(function(){

      $('a.new-position').click(function(event) {
        var $element_clicked = $(this);

        event.preventDefault();

        var position = new PositionModel({
          person_id:       $element_clicked.attr('data-person-id'),
          organization_id: $element_clicked.attr('data-organization-id'),
          title:        $element_clicked.attr('data-title')
        });
        
        var fields_to_hide = {
          person_id:       $element_clicked.attr('data-person-hide-field')       ? true : false,
          organization_id: $element_clicked.attr('data-organization-hide-field') ? true : false,
          title:        $element_clicked.attr('data-title-hide-field')        ? true : false
        };
        
        var view     = new PositionNewView({
          model: position,
          fields_to_hide: fields_to_hide
        });
        
        // render in lightbox
        $.fancybox( view.render().el );

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
