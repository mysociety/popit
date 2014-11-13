/*global popit:false */
// Launch a backbone powered entry box when someone adds/edits a source

define(
  [
    'jquery',
    'underscore',
    'text!templates/source/edit.html'
  ],
  function (
    $,
    _,
    sourceTemplate
  ) {
    "use strict";

    $(function(){
      if (typeof popit === 'undefined') {
         return;
      }

      var template = _.template(sourceTemplate);

      $('#content').on('click', '.source-edit', function(e) {
        e.preventDefault();

        var newLi = $('<li/>').html(template({i: $('ul.sources li').length, source: {}}));
        $('ul.sources').append(newLi);
      });

      $('.source-delete').click(function(e) {
        e.preventDefault();
        $(this).closest('li').remove();
      });

    });
  }
);
