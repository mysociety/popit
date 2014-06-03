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
      $('.entity-details').easytabs({
        animate: false,
        defaultTab: 'li:not(.empty):eq(0)'
      });
    });
  }
);
