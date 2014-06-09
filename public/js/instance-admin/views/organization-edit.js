/*global popit:false */

define([
  'jquery',
  'instance-admin/utils/select2-helpers',
  'instance-admin/views/edit'
], function ($, select2Helpers, EditView) {
  "use strict";

  var OrganizationEditView = EditView.extend({
    initialize: function(options) {
      this.setupAutocomplete();
    },

    setupAutocomplete: function() {
      var classification_input = $('.organization-view input[data-api-name="classification"]');
      if (classification_input.length) {
        var autocomplete_args = select2Helpers.create_arguments_for_autocompleter({
          placeholder:      "e.g Parliament, Party",
          autocomplete_url: "/autocomplete/classifications"
        });
        classification_input.select2(autocomplete_args);
        if (popit.data.classification) {
          classification_input.select2('data', {
            id: popit.data.classification,
            text: popit.data.classification
          });
        }
      }
    },

    enterEditMode: function() {
      EditView.prototype.enterEditMode.apply(this, arguments); // super
      $('#input-classification.edit-mode').hide();
    }
  });

  return OrganizationEditView;
});
