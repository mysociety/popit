/*global popit:false */
// Launch a backbone powered entry box when someone adds/edits an alternate name

define(
  [
    'jquery',
    'underscore',
    'text!templates/identifier/edit.html'
  ],
  function (
    $,
    _,
    identifierTemplate
  ) {
    "use strict";

    $(function(){
      if (typeof popit === 'undefined') {
         return;
      }

      var template = _.template(identifierTemplate);

      $('#content').on('click', '.identifier-edit', function(e) {
        e.preventDefault();

        var newLi = $('<li/>').html(template({i: $('ul.identifiers li').length, identifier: {}}));
        $('ul.identifiers').append(newLi);
      });

    });
  }
);
