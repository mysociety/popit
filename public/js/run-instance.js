
// All the augmenters - add features to various discreet parts of the site
require([
  'augmenters/mailchecker',
  'augmenters/search-box',
  'augmenters/slug-validation',
  'augmenters/sign-in-toggle',
  'augmenters/edit-in-place',
]);

// PopIt editing app - load it and add bits needed
require ([
  'popit/app',
  'popit/actions/person-new',
  'popit/actions/contact-edit',
  'popit/actions/links-edit'
]);

require (
  [ 'order!jquery', 'popit/app' ],
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
