/*global popit:false */

define(
  [
    'jquery'
  ],
  function (
    $
  ) {
    "use strict";

    $(function(){
      $('#save-instance-about').on(
        'click',
        function() {
          $('#instance-about-form').submit();
        }
      );

      $('#save-instance-submit').hide();
    });
  }
);
