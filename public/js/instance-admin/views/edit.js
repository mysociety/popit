/*global popit:false console:false */
define(['jquery', 'Backbone', 'underscore'], function($, Backbone, _) {
  "use strict";

  var EditView = Backbone.View.extend({
    events: {
      'click .entity-enter-edit-mode': 'enterEditMode',
      'click .entity-leave-edit-mode': 'cancelEdit',
      'click .entity-save-changes': 'saveChanges',
      'click .entity-delete': 'deleteConfirm'
    },

    constructor: function(options) {
      Backbone.View.apply(this, arguments);
      this.fields = options.fields || [];
      $('.edit-form').hide();
    },

    enterEditMode: function(e) {
      e.preventDefault();
      $('.view-mode').hide();
      $('.edit-mode').show();
      $('article.entity').hide();
      var tab = $('.person-view .entity-details li.active');
      if ( tab ) {
        $('.edit-form .entity-details').easytabs('select', tab.children('a').attr('href'));
      }
      $('.edit-form').show();
      $('.entity').addClass('editing');

      var inputToFocus = $(e.target).data('input-selector');
      if (inputToFocus !== '') {
        $(inputToFocus).focus();
      }
    },

    cancelEdit: function(e) {
      e.preventDefault();
      this.leaveEditMode();
    },

    saveChanges: function(arg) {
      this.toggleSavingButton();
      $('form.entity').submit();
    },

    leaveEditMode: function() {
      $('.view-mode').show();
      $('.edit-mode').hide();
      $('.edit-form').hide();
      $('article.entity').show();
      $('.entity').removeClass('editing');
      this.resetErrorStates();
    },

    resetErrorStates: function() {
      $('.edit-mode-error').hide();
      $('.has-error').removeClass('has-error');
      $('.alert.backbone-error').slideUp(100);
    },

    toggleSavingButton: function(){
      var newHtml;
      var $btn = $('.entity-save-changes');
      if($btn.is('.btn-loading')){
        newHtml = $btn.html().replace('Saving changes', 'Save changes');
        $btn.removeClass('btn-loading');
        $btn.html(newHtml);
      } else {
        newHtml = $btn.html().replace('Save changes', 'Saving changes');
        $btn.addClass('btn-loading');
        $btn.html(newHtml);
      }
    },

    deleteConfirm: function() {
      if ( window.confirm('Are you sure you want to delete ' + popit.model.get('name')) ) {
        this.deleteObject();
      }
    },

    deleteObject: function() {
      var _this = this;
      popit.model.destroy({
        success: function() {
          window.location = '/' + popit.type + 's';
        },
        error: function(model, response) {
          _this.showBackboneError('There was a problem deleting this ' + popit.type + '.');
        }
      });
    },

    showBackboneError: function(msg) {
      var $alert = $('<div class="alert alert-danger backbone-error"><p class="container"><strong>' + msg + '</strong> Please try again.</p></div>');
      $alert.hide().insertBefore('.entity').slideDown(100);
    }
  });

  return EditView;
});
