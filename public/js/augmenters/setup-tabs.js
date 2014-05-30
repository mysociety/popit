define(
  [
    'jquery',
    'jquery.easytabs'
  ],
  function (
    $
  ) {
    "use strict";

    $(function(){
      $('.entity-details').easytabs({animate: false});
    });
  }
);
