/*global jQuery*/
/*jshint curly:false*/

// there is no version number for this :(
//
// http://jsoverson.github.com/jquery.pulse.js/
//
// Was downloaded from https://github.com/jsoverson/jquery.pulse.js/blob/master/jquery.pulse.js
// most recent commit was cc1f8346935ec77618645dae1ccab52b66770db2 on 2012-05-31 16:11:38

define( ['jquery'], function ( $ ) {
  "use strict";

  var defaults = {
      pulses   : 1,
      interval : 0,
      returnDelay : 0,
      duration : 500
    };

  $.fn.pulse = function(properties, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    options = $.extend({}, defaults, options);

    if (!(options.interval >= 0))    options.interval = 0;
    if (!(options.returnDelay >= 0)) options.returnDelay = 0;
    if (!(options.duration >= 0))    options.duration = 500;
    if (!(options.pulses >= -1))     options.pulses = 1;
    if (typeof callback !== 'function') callback = function(){};

    return this.each(function () {
      var el = $(this),
          property,
          original = {}
        ;

      for (property in properties) {
        if (properties.hasOwnProperty(property)) original[property] = el.css(property);
      }

      var timesPulsed = 0;

      function animate() {
        if (options.pulses > -1 && ++timesPulsed > options.pulses) return callback.apply(el);
        el.animate(
          properties,
          {
            duration : options.duration / 2,
            complete : function(){
              window.setTimeout(function(){
                el.animate(original, {
                  duration : options.duration / 2,
                  complete : function() {
                    window.setTimeout(animate, options.interval);
                  }
                });
              },options.returnDelay);
            }
          }
        );
      }

      animate();
    });
  };

});
