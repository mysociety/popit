/*global popit:false */
// ------------------------
// Launch a backbone powered entry box when someone clicks the new membership button
// ------------------------

define([
  'jquery',
  'underscore',
  'text!templates/membership/new.html',
  'jquery.select2'
], function($, _, membershipTemplate) {
  "use strict";

  var template = _.template(membershipTemplate);

  $(function() {
    $('.add-membership').click(function(e) {
      e.preventDefault();
      var newLi = $('<li/>').html(template({
        i: $('ul.memberships li').length,
        type: popit.type,
        member: {id: popit.data.id, name: popit.data.name},
        membership: {},
        organization: {}
      }));
      $('ul.memberships').append(newLi);
    });
  });

  $('#content').on('click', '.delete-membership', function(e) {
    e.preventDefault();
    $(this).closest('li').remove();
  });
});
