/*global popit:false */
// Launch a backbone powered entry box when someone adds/edits a contact

define(
  [
    'jquery',
    'underscore',
    'text!templates/contact/edit.html'
  ],
  function (
    $,
    _,
    contactTemplate
  ) {
    "use strict"; 

    $(function(){
      if (typeof popit === 'undefined') {
         return;
      }

      $('#content').on('click', '.contact-edit', function(e) {
        e.preventDefault();

        var template = _.template(contactTemplate);
        var newLi = $('<li/>').html(template({i: $('ul.contact_details li').length, contact: {}}));
        $('ul.contact_details').append(newLi);
      });

    });
  }
);
