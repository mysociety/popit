// ------------------------
//  Create the new app
// ------------------------

define(
  [
    'jquery',
    'Backbone',
    'Backbone.Marionette'
  ],
  function (
    $,
    Backbone,
    BackboneMarionette
  ) {

    var App = new Backbone.Marionette.Application();

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
