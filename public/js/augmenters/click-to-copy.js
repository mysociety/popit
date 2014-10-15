// ------------------------
//  Uses zClipboard to copy text from an <input> on .btn press.
// ------------------------

require(['jquery', '/js/libs/zeroclipboard/ZeroClipboard.js'], function($, ZeroClipboard) {
  "use strict";

  ZeroClipboard.config({
    moviePath: '/js/libs/zeroclipboard/ZeroClipboard.swf'
  });

  $(function() {

    // Cute upwards floating/fading animation
    // designed primarily for <input> elements
    var marioFloat = function($element){
      var $clone = $element.clone().appendTo('body');
      $clone.css({
        position: 'absolute',
        top: $element.offset().top,
        left: $element.offset().left,
        zIndex: 100,
        width: $element.outerWidth(),
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        '-webkit-box-shadow': 'none',
        'box-shadow': 'none',
        opacity: 1
      }).animate({
        top: $element.offset().top - 100,
        opacity: 0
      }, 500, function(){
        $clone.remove();
      });
    };

    $('.click-to-copy .btn').each(function(event) {
      var $btn = $(this);
      var $ipt = $(this).parents('.click-to-copy').find('input').eq(0);
      var clip = new ZeroClipboard($btn[0]);

      clip.setText($ipt.val());

      clip.on('load', function() {
        clip.on('dataRequested', function ( client, args ) {
          clip.setText($ipt.val());
        }).on('complete', function(){
          var btnHtml = $btn.html();
          $btn.html('Copied!').addClass('zeroclipboard-is-copied').blur();
          marioFloat($ipt);
          setTimeout(function(){
            $btn.html(btnHtml).removeClass('zeroclipboard-is-copied');
          }, 2000);
        });
        $btn.show();
      });
    });

  });

});
