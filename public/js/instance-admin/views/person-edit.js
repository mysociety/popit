/*global popit:false */

define([
  'jquery',
  'underscore',
  'instance-admin/views/edit'
], function ($, _, EditView) {
  "use strict";

  var PersonEditView = EditView.extend({
    events: function() {
      return _.extend({}, EditView.prototype.events, {
        'click .entity-save-and-add-another': 'saveAndAddAnother',
        'keyup .entity-header': 'checkWhetherHeaderIsComplete',
        'click .carry-on-editing': 'hideHeaderCompletionMessage'
      });
    },

    saveAndAddAnother: function() {
      $('.enough-toolbar:visible').fadeOut(100);
      this.saveChanges(function(){
        window.location.href = '/persons/new';
      });
    },

    checkWhetherHeaderIsComplete: function() {
      var requiredFields = ['#input-name', '#input-party', '#input-constituency'];
      var headerComplete = _.every(requiredFields, function(selector) {
        return $.trim($(selector).val()).length > 2;
      });

      if (headerComplete) {
        $('.enough-toolbar:hidden').fadeIn(250);
      } else {
        $('.enough-toolbar:visible').fadeOut(250);
      }
    },

    hideHeaderCompletionMessage: function() {
      $('.enough-toolbar').fadeOut(250, function(){
        $(this).remove(); // stop the message appearing again until the page is reloaded
      });
    },

    leaveEditMode: function() {
      EditView.prototype.leaveEditMode.apply(this, arguments);
      $('.enough-toolbar:visible').hide();
    }
  });

  return PersonEditView;
});
