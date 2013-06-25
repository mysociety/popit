// ------------------------
//  Create the new app
// ------------------------

define(
  [
    'jquery',
    'Backbone',
    'jquery.fancybox'
  ],
  function (
    $,
    Backbone
  ) {
    "use strict"; 

    $.fancybox.defaults.openSpeed = 100;
    $.fancybox.defaults.closeSpeed = 100;
    $.fancybox.defaults.helpers.overlay.speedIn = 100;
    $.fancybox.defaults.helpers.overlay.speedOut = 100;

  }
);
