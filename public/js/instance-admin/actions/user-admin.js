/*global popit:false */

require(['jquery'], function($) {
  "use strict";

  $(function(){
    $('.js-access-control__controls').each(function() {
      var container = $(this);
      var dropdown = container.find('.js-access-control__dropdown');
      var form = container.find('.js-access-control__form');

      dropdown.find('.dropdown-menu a:not(.js-remove)').on('click', function(e) {
        e.preventDefault();
        var role = $(this).data('role');
        form.find('input[value="' + role + '"]').attr('checked', 'checked');
        form.submit();
      });
    });
  });
});
