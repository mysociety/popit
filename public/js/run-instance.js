
// All the augmenters - add features to various discreet parts of the site
require([
  'augmenters/mailchecker',
  'augmenters/search-box',
  'augmenters/migration',
  'augmenters/slug-validation',
  'augmenters/sign-in-toggle',
  'augmenters/edit-in-place',
]);

// PopIt editing app - load it and add bits needed
require ([
  'instance-admin/app',
  'instance-admin/actions/person-new',
  'instance-admin/actions/contact-edit',
  'instance-admin/actions/links-edit'
]);

require (
  [ 'order!jquery', 'instance-admin/app' ],
  function ($, App) {

    // FIXME - we shouldn't be mucking around with the global jQuery behaviour like this.
    // handle the API wrapping the responses in result(s): {...}
    $.ajaxSetup({
      converters: {
        "text json": function (json) {
          var data = $.parseJSON(json);
          return data.results || data.result || data;
        }
      }
    });
    
    $( function() { App.start() } );
  }
);
