/*global popit:false */
// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-person button
// ------------------------

define(
  [
    'jquery',
    'instance-admin/models/person',
    'instance-admin/views/remove-model',
    'text!templates/person/remove.html',
    'jquery.fancybox'
  ],
  function (
    $,
    PersonModel,
    RemoveModelView,
    personTemplate
  ) {
    "use strict"; 

    $(function(){

      $('a.delete-person').click(function(event) {
        event.preventDefault();

        var $link = $(this),
            view = new RemoveModelView({
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
