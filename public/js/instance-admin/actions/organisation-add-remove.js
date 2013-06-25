// ------------------------
//  Launch a backbone powered entry box when someone clicks the new-organisation button
// ------------------------

define(
  [
    'jquery',
    'instance-admin/models/organisation',
    'instance-admin/views/organisation-new',
    'instance-admin/views/organisation-remove',
    'jquery.fancybox'
  ],
  function (
    $,
    OrganisationModel,
    OrganisationNewView,
    OrganisationRemoveView
  ) {
    "use strict"; 

    $(function(){

      $('a.new-organisation').click(function(event) {

        event.preventDefault();

        var organisation = new OrganisationModel({});
        var view         = new OrganisationNewView({model: organisation});
        
        // render in lightbox, focus on first input
        $.fancybox( view.render().el );
        view.$(':input:first').focus();
      });
      
      $('a.delete-organisation').click(function(event) {

        var $link = $(this);
        event.preventDefault();

        var organisation = new OrganisationModel({
          id: $link.attr('data-id')
        });

        organisation.fetch({
          success: function (model, response) {
            var view   = new OrganisationRemoveView({model: model});
            $.fancybox( view.render().el );            
          }
        });
        
      });
      
    });
  }
);
