/*global popit:false */
// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-organization button
// ------------------------

define(
  [
    'jquery',
    'instance-admin/models/organization',
    'instance-admin/views/organization-new',
    'instance-admin/views/remove-model',
    'text!templates/organization/remove.html',
    'jquery.fancybox'
  ],
  function (
    $,
    OrganizationModel,
    OrganizationNewView,
    RemoveModelView,
    orgTemplate
  ) {
    "use strict"; 

    $(function(){
      $('a.delete-organization').click(function(event) {
        event.preventDefault();

        var $link = $(this),
            view = new RemoveModelView({
              model: popit.model,
              template: orgTemplate,
              submitSuccess: function (model, response) {
                document.location = '/organizations';
              }
            });
        $.fancybox( view.render().el );
        
      });
      
    });
  }
);
