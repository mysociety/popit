require(['jquery'], function($) {
  "use strict";

  var linkSelector = '.js-source__link';
  var popupDisplayClass = 'source__popup--display';

  $(function() {
    $(document).on('click', linkSelector, function showSourceField(e) {
      e.preventDefault();
      var displayID = $(this).attr('href');
      var $display = $(displayID);
      $display.toggleClass(popupDisplayClass);
    });
  });
});
