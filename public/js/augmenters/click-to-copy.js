// ------------------------
//  Uses zClipboard to copy text from an <input> on .btn press.
// ------------------------

require(['jquery', 'js/libs/zeroclipboard/ZeroClipboard.js'], function($, ZeroClipboard) {
  "use strict";

  ZeroClipboard.config({
    moviePath: '/js/libs/zeroclipboard/ZeroClipboard.swf'
  })

  $(function() {

    $('.click-to-copy .btn').each(function(event) {
      var $btn = $(this);
      var $ipt = $(this).parents('.click-to-copy').find('input').eq(0);
      var clip = new ZeroClipboard($btn[0]);

      clip.setText($ipt.val());

      clip.on('dataRequested', function ( client, args ) {
        clip.setText($ipt.val());
      }).on('complete', function(){
        var btnHtml = $btn.html();
        $btn.html('Copied!').addClass('zeroclipboard-is-copied').blur();
        setTimeout(function(){
          $btn.html(btnHtml).removeClass('zeroclipboard-is-copied');
        }, 2000);
      });
    });

  });

});
