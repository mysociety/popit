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
      this.fields = options.fields || [];
      Backbone.View.apply(this, arguments);
    },

    enterEditMode: function(e) {
      $('.view-mode').hide();
      $('.edit-mode').show();
      $('.entity').addClass('editing');
      popit.model.on('invalid', this.onInvalid);
      _.each(this.fields, function(field) {
        var input = $('.edit-mode[data-api-name="' + field + '"]');
        input.data('original', input.val());
      });

      var inputToFocus = $(e.target).data('input-selector');
      if (inputToFocus !== '') {
        $(inputToFocus).focus();
      }
    },

    cancelEdit: function() {
      this.leaveEditMode();
      _.each(this.fields, function(field) {
        var changed = '.edit-mode[data-api-name="' + field + '"]';
        $(changed).val($(changed).data('original'));
      });
    },

    saveChanges: function(arg) {
      var _this = this;
      _this.toggleSavingButton();
      popit.model.save(_this.serialize(), {
        success: function() {
          if (typeof arg == 'function') {
            arg(); // optional success callback
          } else {
            _this.populate();
            _this.toggleSavingButton();
            _this.leaveEditMode();
          }
        },
        error: function(obj, err) {
          console.error(err);
          _this.showBackboneError('There was a problem saving your changes.');
          _this.toggleSavingButton();
        }
      });
    },

    leaveEditMode: function() {
      $('.view-mode').show();
      $('.edit-mode').hide();
      $('.entity').removeClass('editing');
      this.resetErrorStates();
      popit.model.off('invalid', this.onInvalid);
    },

    resetErrorStates: function() {
      $('.edit-mode-error').hide();
      $('.has-error').removeClass('has-error');
      $('.alert.backbone-error').slideUp(100);
    },

    onInvalid: function(model, err) {
      _.each(this.fields, function(field) {
        if ( err[field] ) {
          var $dd = $('.edit-mode[data-api-name="' + field + '"]').parent();
          $dd.addClass('has-error'); // the text input and error text
          $dd.prev().addClass('has-error'); // the label
          $('.edit-mode-error', $dd).show();
          this.toggleSavingButton();
        }
      }, this);
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

    serialize: function() {
      var object = {};
      _.each(this.fields, function(field) {
        object[field] = $('.edit-mode[data-api-name="' + field + '"]').val() || null;
      });
      return object;
    },

    populate: function() {
      _.each(this.fields, function(field) {
        var selector = '.view-mode[data-api-name="' + field + '"]';
        var value = popit.model.get(field);
        if ( value === null ) {
            value = '';
        }
        $(selector).text($.trim(value));
      });
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
