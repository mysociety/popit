/*global popit:false */
// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-organization button
// ------------------------

define(
  [
    'jquery',
    'instance-admin/models/organization',
    'instance-admin/views/organization-new',
    'instance-admin/views/organization-remove',
    'jquery.fancybox'
  ],
  function (
    $,
    OrganizationModel,
    OrganizationNewView,
    OrganizationRemoveView
  ) {
    "use strict"; 

    $(function(){

      $('a.new-organization').click(function(event) {

        event.preventDefault();

        var organization = new OrganizationModel({});
        var view         = new OrganizationNewView({model: organization});
        
        // render in lightbox, focus on first input
        $.fancybox( view.render().el );
        view.$(':input:first').focus();
      });
      
      $('a.delete-organization').click(function(event) {

        var $link = $(this);
        event.preventDefault();

        var view = new OrganizationRemoveView({model: popit.model});
        $.fancybox( view.render().el );
        
      });
      
    });
  }
);
