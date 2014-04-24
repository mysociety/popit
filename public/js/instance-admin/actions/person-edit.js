define(['jquery'], function ($) {
  "use strict";

  var enterEditMode = function(){
    $('.view-mode').hide();
    $('.edit-mode').show();
    $('.entity').addClass('editing');
  }

  var leaveEditMode = function(){
    $('.view-mode').show();
    $('.edit-mode').hide();
    $('.entity').removeClass('editing');
    resetErrorStates();
  }

  var resetErrorStates = function(){
    $('.edit-mode-error').hide();
    $('.has-error').removeClass('has-error');
    $('.alert.backbone-error').slideUp(100);
  }

  var showBackboneError = function(){
    var $alert = $('<div class="alert alert-danger backbone-error"><p class="container"><strong>There was a problem saving your changes.</strong> Please try again.</p></div>');
    $alert.hide().insertBefore('.entity').slideDown(100);
  }

  var cancelEdit = function(){
      leaveEditMode();
      var fields = [ 'name', 'summary', 'birth_date', 'death_date' ];
      for ( var i = 0; i < fields.length; i++ ) {
        var field = fields[i];
        var original = '.view-mode[data-api-name="' + field + '"]';
        var changed = '.edit-mode[data-api-name="' + field + '"]';
        $(changed).val($(original).text());
      }
  }

  var saveChanges = function(){
    toggleSavingButton();
    var name = $('.edit-mode[data-api-name="name"]').val();
    if ( !name ) {
      var $dd = $('.edit-mode[data-api-name="name"]').parent();
      $dd.addClass('has-error'); // the text input and error text
      $dd.prev().addClass('has-error'); // the label
      $('.edit-mode-error', $dd).show();
      toggleSavingButton();
      return;
    }
    popit.model.set('name', name);
    popit.model.set('summary', $('.edit-mode[data-api-name="summary"]').val());
    var dates = ['death_date', 'birth_date'];
    for ( var i = 0; i < dates.length; i++ ) {
        var selector = '.edit-mode[data-api-name="' + dates[i] + '"]';
        var value = $(selector).val();
        if ( ! value ) {
            value = null;
        }
        popit.model.set(dates[i], value);
    }
    popit.model.save(
      {},
      {
        success: function() {
          var fields = [ 'name', 'summary', 'birth_date', 'death_date' ];
          for ( var i = 0; i < fields.length; i++ ) {
            var field = fields[i];
            var selector = '.view-mode[data-api-name="' + field + '"]';
            var value = popit.model.get(field);
            if ( value == null ) {
                value = '';
            }
            $(selector).text(value);
          }
          toggleSavingButton();
          leaveEditMode();
        },
        error: function(obj, err) {
            console.log(err);
            showBackboneError();
            toggleSavingButton();
        }
      }
    );
  }

  var toggleSavingButton = function(){
    var $btn = $('.entity-save-changes');
    if($btn.is('.btn-loading')){
      var newHtml = $btn.html().replace('Saving changes', 'Save changes');
      $btn.removeClass('btn-loading');
      $btn.html(newHtml);
    } else {
      var newHtml = $btn.html().replace('Save changes', 'Saving changes');
      $btn.addClass('btn-loading');
      $btn.html(newHtml);
    }
  }

  var deletePersonConfirm = function(){
      if ( window.confirm('Are you sure you want to delete ' + popit.model.get('name')) ) {
        deletePerson();
      }
  }

  var deletePerson = function(){
    popit.model.destroy({
        success: function() {
          window.location = '/persons';
        },
        error: function(model, response) {
          alert('Failed to delete person, please try again');
        }
    });
  }

  $(function(){
    $('.entity-enter-edit-mode').on('click', enterEditMode);
    $('.entity-leave-edit-mode').on('click', cancelEdit);
    $('.entity-save-changes').on('click', saveChanges);
    $('.entity-delete').on('click', deletePersonConfirm);
  });

});
