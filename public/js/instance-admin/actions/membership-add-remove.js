/*global popit:false */
// ------------------------
// Launch a backbone powered entry box when someone clicks the new membership button
// ------------------------

define(
  [
    'jquery',
    'instance-admin/models/membership',
    'instance-admin/models/person',
    'instance-admin/models/organization',
    'instance-admin/models/post',
    'instance-admin/views/membership-new',
    'instance-admin/views/remove-model',
    'text!templates/membership/remove.html',
    'jquery.fancybox'
  ],
  function (
    $,
    MembershipModel,
    PersonModel,
    OrganizationModel,
    PostModel,
    MembershipNewView,
    RemoveModelView,
    mTemplate
  ) {
    "use strict";

    $(function(){

      function fetch_model($link) {
        var $element = $link.closest('li'),
            cid = $element.data('id'),
            collection = popit.model.memberships,
            object;

        // create membership. Might be existing one, or a new one.
        if (cid) {
          object = collection.get(cid);
          object.fetch({ async: false });
          // Need to set a full object on the link back, not just ID
          if (popit.type == 'person') {
            object.set('person_id', popit.model.attributes);
            var o = new OrganizationModel({ id: object.get('organization_id') });
            o.fetch({ async: false });
            object.set('organization_id', o.attributes);
            if ( object.get('post_id') ) {
              o = new PostModel({ id: object.get('post_id') });
              o.fetch({ async: false });
              object.set('post_id', o.attributes);
            }
          } else if (popit.type == 'organization') {
            object.set('organization_id', popit.model.attributes);
            var p = new PersonModel({ id: object.get('person_id') });
            p.fetch({ async: false });
            object.set('person_id', p.attributes);
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
        return object;
      }

      $('.edit-membership').live('click', function(event) {
        event.preventDefault();

        var object = fetch_model($(this));

        var $link    = $(this);
        var $element = $link.hasClass('add') ?
            null :
            $link.closest('li');

        if (!$element || !$element.length) {
            $element = $('<li/>');
            $link.closest('ul').prepend($element);
        }

        var fields_to_hide = {};
        if (popit.type == 'person') {
          fields_to_hide.person = true;
        } else if (popit.type == 'organization') {
          fields_to_hide.organization = true;
        }

        var view = new MembershipNewView({
          source_el: $element,
          model: object,
          type: popit.type,
          fields_to_hide: fields_to_hide
        });

        $.fancybox( view.render().el );

      });

      $('.delete-membership').live('click', function(event) {
        event.preventDefault();

        var $link = $(this),
            $element = $link.closest('li'),
            model = fetch_model($link),
            view = new RemoveModelView({
              model: model,
              template: mTemplate,
              submitSuccess: function (model, response) {
                // Remove attached membership row, and this view
                $element.remove();
                $.fancybox.close();
                this.remove();
              }
            });

        $.fancybox( view.render().el );

      });

    });
  }
);
