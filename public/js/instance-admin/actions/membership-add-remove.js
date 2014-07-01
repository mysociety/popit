/*global popit:false */
// ------------------------
// Launch a backbone powered entry box when someone clicks the new membership button
// ------------------------

define([
  'jquery',
  'underscore',
  'instance-admin/utils/select2-helpers',
  'text!templates/membership/new.html',
  'jquery.select2'
], function($, _, select2helpers, membershipTemplate) {
  "use strict";

  function setupSelect2() {
    var select2orgArgs = select2helpers.create_arguments_for_model({
      placeholder: "e.g Apple Inc, UK Parliament, Kenyatta University",
      url: '/autocomplete/organizations'
    });

    $('.js-membership-organization').each(function() {
      var $input = $(this);
      $input.select2(select2orgArgs);
      $input.select2('data', {id: $input.val(), text: $input.data('org-name')});

      $input.on('change', function(e) {
        var data = $input.select2('data');
        $('input.js-membership-organization-name').val(data.text);
      });
    });

    var select2membershipArgs = select2helpers.create_arguments_for_autocompleter({
      placeholder:      "e.g President, CEO, Professor, Coach",
      autocomplete_url: "/autocomplete/memberships"
    });

    $('.js-membership-role').each(function() {
      var $input = $(this);
      $input.select2(select2membershipArgs);
      $input.select2('data', {id: $input.val(), text: $input.val()});
    });

    var select2personArgs = select2helpers.create_arguments_for_model({
      placeholder: "e.g Joe Bloggs, Jane Smith",
      url: '/autocomplete/persons'
    });

    $('.js-membership-person').each(function() {
      var $input = $(this);
      $input.select2(select2personArgs);
      $input.select2('data', {id: $input.val(), text: $input.data('person-name')});

      $input.on('change', function(e) {
        var data = $input.select2('data');
        $('input.js-membership-person-name').val(data.text);
      });
    });
  }

  var template = _.template(membershipTemplate);

  $(function() {
    $('#content').on('click', '.add-membership', function(e) {
      e.preventDefault();
      var member, organization;

      if (popit.type === 'person') {
        member = popit.data;
        organization = {};
      } else if (popit.type === 'organization') {
        member = {};
        organization = popit.data;
      }
      var newLi = $('<li/>').html(template({
        i: $('form.editing ul.memberships li').length,
        type: popit.type,
        member: member,
        membership: {},
        organization: organization
      }));
      $('form.editing ul.memberships').append(newLi);
      setupSelect2();
    });

    setupSelect2();
  });

  $('#content').on('click', '.delete-membership', function(e) {
    e.preventDefault();
    // if we are removing the primary membership then we need to empty the
    // party and consituency inputs as otherwise the membership is recreated
    // when we save
    var parent = $(this).closest('li');
    var main_org_id = $('input[name="organization_id"]').val();
    if ( main_org_id ) {
      var org_id = parent.find('.js-membership-organization').select2('val');
      if (org_id == main_org_id) {
        $('input[name="organization_id"]').val('');
        $('#input-party').val('');
        $('#input-constituency').val('');
      }
    }
    parent.remove();
  });
});
