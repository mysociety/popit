/*global popit:false */
// ------------------------
//  Create the new app
// ------------------------

define(
  [
    'jquery',
    'Backbone',
    'instance-admin/models/person',
    'instance-admin/models/organization',
    'jquery.fancybox'
  ],
  function (
    $,
    Backbone,
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
        if (popit.data && popit.data._id) {
            popit.data.id = popit.data._id;
            delete popit.data._id;
        }
        if (popit.type == 'person') {
            popit.model = new PersonModel(popit.data);
            setup_sub_model_links('links');
            setup_sub_model_links('contact_details');
            setup_sub_model_links('other_names');
        } else if (popit.type == 'organization') {
            popit.model = new OrganizationModel(popit.data);
            setup_sub_model_links('links');
            setup_sub_model_links('contact_details');
            setup_sub_model_links('other_names');
        }
    });

    function setup_sub_model_links(key) {
      popit.model[key].on('reset', function(){
        $('section.' + key + ' li').each(function(i, l){
          var m = popit.model.get(key).at(i);
          if (!m) return;
          $.data(l, 'id', m.cid);
        });
      });
      popit.model[key].trigger('reset');
    }

  }
);
