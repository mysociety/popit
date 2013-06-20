// ------------------------
//  Create the new app
// ------------------------

define(
  [
    'jquery',
    'Backbone',
    'Backbone.Marionette',
    'jquery.fancybox'
  ],
  function (
    $,
    Backbone,
    BackboneMarionette
  ) {
    "use strict"; 

    var App = new Backbone.Marionette.Application();

    $.fancybox.defaults.openSpeed = 100;
    $.fancybox.defaults.closeSpeed = 100;
    $.fancybox.defaults.helpers.overlay.speedIn = 100;
    $.fancybox.defaults.helpers.overlay.speedOut = 100;

    App.on(
      'start',
      function(opts) {
        // only show the admin links once the app is up and running. Prevents
        // people (and tests) clicking on links that have no effect.
        $('body').addClass('instance-admin-app-active');
      }
    );

    return App;

  }
);
