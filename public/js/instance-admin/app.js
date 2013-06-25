/*global popit:false */
// ------------------------
//  Create the new app
// ------------------------

define(
  [
    'jquery',
    'Backbone',
    'instance-admin/models/person',
    'instance-admin/models/organisation',
    'jquery.fancybox'
  ],
  function (
    $,
    Backbone,
    PersonModel,
    OrganisationModel
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
        } else if (popit.type == 'organization') {
            popit.model = new OrganisationModel(popit.data);
        }
    });

  }
);
