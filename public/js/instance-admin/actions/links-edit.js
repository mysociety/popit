/*global popit:false */
// Launch a backbone powered entry box when someone adds/edits a link

define(
  [
    'jquery',
    'underscore',
    'text!templates/link/edit.html'
  ],
  function (
    $,
    _,
    linkEditTemplate
  ) {
    "use strict";     

    $(function(){
      if (typeof popit === 'undefined') {
         return;
      }

      $('#content').on('click', '.link-edit', function(e) {
        e.preventDefault();
        var template = _.template(linkEditTemplate);
        var newLi = $('<li/>').html(template({i: $('ul.links li').length, link: {}}));
        $('ul.links').append(newLi);
      });

    });
  }
);
