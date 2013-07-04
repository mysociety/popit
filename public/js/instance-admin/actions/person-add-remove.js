/*global popit:false */
// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

define(
  [
    'jquery',
    'instance-admin/models/person',
    'instance-admin/views/person-new',
    'instance-admin/views/remove-modal',
    'text!templates/person/remove.html',
    'jquery.fancybox'
  ],
  function (
    $,
    PersonModel,
    PersonNewView,
    RemoveModalView,
    personTemplate
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
        event.preventDefault();

        var $link = $(this),
            view = new RemoveModalView({
              model: popit.model,
              template: personTemplate,
              submitSuccess: function (model, response) {
                document.location = '/persons';
              }
            });
        $.fancybox( view.render().el );
        
      });
      
    });
  }
);
