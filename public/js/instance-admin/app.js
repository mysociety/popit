// ------------------------
//  Create the new app
// ------------------------

define(
  [
    'Backbone',
    'Backbone.Marionette'
  ],
  function (
    Backbone,
    BackboneMarionette
  ) {

    var App = new Backbone.Marionette.Application();
    return App;

  }
);
