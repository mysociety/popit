/*global popit:false */
// ------------------------
//  Create the new app
// ------------------------

define(
  [
    'jquery',
    'Backbone',
    'jsoneditor',
    'instance-admin/collections/posts',
    'instance-admin/collections/memberships',
    'instance-admin/models/person',
    'instance-admin/models/organization',
    'jquery.fancybox'
  ],
  function (
    $,
    Backbone,
    jsoneditor,
    PostCollection,
    MembershipCollection,
    PersonModel,
    OrganizationModel
  ) {
    "use strict"; 

    $.fancybox.defaults.openSpeed = 100;
    $.fancybox.defaults.closeSpeed = 100;
    $.fancybox.defaults.helpers.overlay.speedIn = 100;
    $.fancybox.defaults.helpers.overlay.speedOut = 100;

    $(function(){
        if (typeof popit === 'undefined') {
           return;
        }
        // Switch any "_id"s to "id"s
        if (popit.data && popit.data._id) {
            popit.data.id = popit.data._id;
            delete popit.data._id;
        }
        if (popit.posts) {
          $.each(popit.posts, function(i, m) {
            m.id = m._id; delete m._id;
          });
        }
        if (popit.memberships) {
          popit.memberships = $.map(popit.memberships, function(m) {
            return { 'id': m };
          });
        }
        if (popit.type == 'person') {
            popit.model = new PersonModel(popit.data);
            setup_sub_model_links('links');
            setup_sub_model_links('contact_details');
            setup_sub_model_links('other_names');
            setup_sub_model_links('identifiers');
            popit.model.memberships = new MembershipCollection(popit.memberships);
            setup_sub_model_links('memberships'); // No reset happens, just for initial setup
        } else if (popit.type == 'organization') {
            popit.model = new OrganizationModel(popit.data);
            setup_sub_model_links('links');
            setup_sub_model_links('contact_details');
            setup_sub_model_links('other_names');
            setup_sub_model_links('identifiers');
            popit.model.posts = new PostCollection(popit.posts);
            setup_sub_model_links('posts'); // No reset happens, just for initial setup
            popit.model.memberships = new MembershipCollection(popit.memberships);
            setup_sub_model_links('memberships'); // Ditto
        }

        var jsoncontainer = $('#jsoneditor');
        if (jsoncontainer.length) {
            var editor = new jsoneditor.JSONEditor(jsoncontainer[0], {
                change: function() {
                    //var data = { 'data': editor.get() };
                    var data = editor.get();
                    Backbone.trigger('in-place-edit', data);
                }
            });
            //editor.set(popit.data.data || {});
            editor.set(JSON.parse(JSON.stringify(popit.data)));
        }

    });

    function setup_sub_model_links(key) {
      popit.model[key].on('reset', function(){
        $('section.' + key + ' li').each(function(i, l){
          var m = popit.model[key].at(i);
          if (!m) return;
          $.data(l, 'id', m.cid);
        });
      });
      popit.model[key].trigger('reset');
    }

  }
);
