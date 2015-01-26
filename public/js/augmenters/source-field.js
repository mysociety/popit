require(['jquery'], function($) {
  "use strict";

  var linkSelector = '.js-source__link';
  var popupSelector = '.js-source__popup';
  var popupDisplayClass = 'source__popup--display';

  $(function() {
    $(document).on('click', linkSelector, function showSourceField(e) {
      e.preventDefault();
      var $this = $(this);
      var popup = $this.next(popupSelector);
      popup.toggleClass(popupDisplayClass);
    });
  });
});
