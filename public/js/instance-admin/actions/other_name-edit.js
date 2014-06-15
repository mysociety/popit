/*global popit:false */
// Launch a backbone powered entry box when someone adds/edits an alternate name

define(
  [
    'jquery',
    'underscore',
    'text!templates/other_name/edit.html'
  ],
  function (
    $,
    _,
    otherNameTemplate
  ) {
    "use strict"; 

    $(function(){
      if (typeof popit === 'undefined') {
         return;
      }
      var template = _.template(otherNameTemplate);

      $('#content').on('click', '.other_name-edit', function(e) {
        e.preventDefault();
        var newLi = $('<li/>').html(template({i: $('ul.other_names li').length}));
        $('ul.other_names').append(newLi);
      });

      $('.other_name-delete').click(function(e) {
        e.preventDefault();
        $(this).closest('li').remove();
      });

    });
  }
);
