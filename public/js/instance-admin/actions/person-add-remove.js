/*global popit:false */
// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

define(
  [
    'jquery',
    'instance-admin/models/person',
    'instance-admin/views/person-new',
    'instance-admin/views/person-remove',
    'jquery.fancybox'
  ],
  function (
    $,
    PersonModel,
    PersonNewView,
    PersonRemoveView
  ) {
    "use strict"; 

    $(function(){

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

        var view = new PersonRemoveView({model: popit.model});
        $.fancybox( view.render().el );
        
      });
      
    });
  }
);
