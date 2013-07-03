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

      $('.edit-membership').click(function(event) {
        event.preventDefault();

        var $link    = $(this),
            $element = $link.closest('li'),
            cid = $element.data('id'),
            collection = popit.model.memberships,
            object;

        var fields_to_hide = {};
        if (popit.type == 'person') {
          fields_to_hide.person = true;
        } else if (popit.type == 'organization') {
          fields_to_hide.organization = true;
        }

        // create membership. Might be existing one, or a new one.
        if (cid) {
          object = collection.get(cid);
          // Need to set a full object on the link back, not just ID
          if (popit.type == 'person') {
            object.set('person_id', popit.model.attributes);
          } else if (popit.type == 'organization') {
            object.set('organization_id', popit.model.attributes);
          }
          object.exists = true;
        } else {
          var defaults = {};
          if (popit.type == 'person') {
            defaults.person_id = popit.model.attributes;
          } else if (popit.type == 'organization') {
            defaults.organization_id = popit.model.attributes;
          }
          object = new collection.model(defaults, { collection: collection });
          object.exists = false;
        }

        var view     = new MembershipNewView({
          model: object,
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
