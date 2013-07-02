/*global popit:false */
// ------------------------
// Launch a backbone powered entry box when someone clicks the new membership button
// ------------------------

define(
  [
    'jquery',
    'instance-admin/models/membership',
    'instance-admin/views/membership-new',
    // 'instance-admin/views/membership-remove',
    'jquery.fancybox'
  ],
  function (
    $,
    MembershipModel,
    MembershipNewView
    //MembershipRemoveView
  ) {
    "use strict";

    $(function(){

      $('a.new-membership').click(function(event) {
        var $element_clicked = $(this);

        event.preventDefault();

        var attrs = {}, fields_to_hide = {};
        if (popit.type == 'person') {
          attrs.person_id = popit.model.id;
          fields_to_hide.person = true;
        } else if (popit.type == 'organization') {
          attrs.organization_id = popit.model.id;
          fields_to_hide.organization = true;
        }
        var membership = new MembershipModel(attrs);

        var view     = new MembershipNewView({
          model: membership,
          fields_to_hide: fields_to_hide
        });

        // render in lightbox
        $.fancybox( view.render().el );

      });

      // $('a.delete-membership').click(function(event) {
      //
      //   var $link = $(this);
      //   event.preventDefault();
      //
      //   var membership = new MembershipModel({
      //     id: $link.attr('data-id')
      //   });
      //
      //   membership.fetch({
      //     success: function (model, response) {
      //       var view   = new MembershipRemoveView({model: model});
      //       $.fancybox( view.render().el );
      //     }
      //   });
      //
      // });

    });
  }
);
