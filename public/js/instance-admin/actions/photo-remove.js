define(
  [
    'jquery',
    'instance-admin/views/remove-modal',
    'text!templates/photo-remove.html',
    'jquery.fancybox'
  ],
  function (
    $,
    RemoveModalView,
    template
  ) {
    "use strict";

    $(function(){

      $('.delete-photo').click(function(event) {
        event.preventDefault();

        var $link = $(this),
            view = new RemoveModalView({ template: template });

        $.fancybox( view.render({ image_url: $link.attr('data-image-url') }).el );

      });

    });
  }
);
