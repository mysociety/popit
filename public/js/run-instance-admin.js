
// All the augmenters - add features to various discreet parts of the site
require([
  'augmenters/mailchecker',
  'augmenters/migration',
  'augmenters/slug-validation',
  'augmenters/edit-in-place'
]);

// PopIt editing app - load it and add bits needed
require ([
  'instance-admin/app',
  'instance-admin/actions/about-save',
  'instance-admin/actions/photo-remove',
  'instance-admin/actions/person-add-remove',
  'instance-admin/actions/organization-add-remove',
  'instance-admin/actions/membership-add-remove',
  'instance-admin/actions/post-edit',
  'instance-admin/actions/contact-edit',
  'instance-admin/actions/other_name-edit',
  'instance-admin/actions/identifier-edit',
  'instance-admin/actions/links-edit',
  'instance-admin/actions/person-edit',
  'instance-admin/actions/person-new',
  'instance-admin/actions/organization-edit'
]);

require (
  [ 'order!jquery' ],
  function ($) {
    "use strict";

    // TODO - we shouldn't be mucking around with the global jQuery behaviour like this.
    // handle the API wrapping the responses in result(s): {...}

    // FIXME fix this by creating a base model/collection, using the
    // http://backbonejs.org/#Model-parse method and then inheriting from that.

    $.ajaxSetup({
      converters: {
        "text json": function (json) {
          var data = $.parseJSON(json);

          // If data is true use it to find the return value. If it is not true then
          // return an empty object so that BackBone models are happy. This is a
          // workaround so that we can use a 204 in the API responses, which normally
          // jQuery would not pass on correctly (or rather).
          return (
            data ?
            data.results || data.result || data :
            {}
          );
        }
      }
    });
  }
);
