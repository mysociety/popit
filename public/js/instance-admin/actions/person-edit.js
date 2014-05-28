/*global popit:false console:false */
define(['jquery', 'jquery.easytabs'], function ($) {
  "use strict";

  var fields = [ 'name', 'summary', 'birth_date', 'death_date', 'organization', 'organization_id' ];

  var onInvalid = function(model, err) {
      for ( var i = 0; i < fields.length; i++ ) {
        var field = fields[i];
        if ( err[field] ) {
          var $dd = $('.edit-mode[data-api-name="' + field + '"]').parent();
          $dd.addClass('has-error'); // the text input and error text
          $dd.prev().addClass('has-error'); // the label
          $('.edit-mode-error', $dd).show();
          toggleSavingButton();
        }
      }
  };

  var enterEditMode = function(){
    $('.view-mode').hide();
    $('.edit-mode').show();
    $('.entity').addClass('editing');
      popit.model.on('invalid', onInvalid);
  };

  var leaveEditMode = function(){
    $('.view-mode').show();
    $('.edit-mode').hide();
    $('.entity').removeClass('editing');
    resetErrorStates();
    popit.model.off('invalid', onInvalid);
  };

  var resetErrorStates = function(){
    $('.edit-mode-error').hide();
    $('.has-error').removeClass('has-error');
    $('.alert.backbone-error').slideUp(100);
  };

  var showBackboneError = function(msg){
    var $alert = $('<div class="alert alert-danger backbone-error"><p class="container"><strong>' + msg + '</strong> Please try again.</p></div>');
    $alert.hide().insertBefore('.entity').slideDown(100);
  };

  var cancelEdit = function(){
      leaveEditMode();
      for ( var i = 0; i < fields.length; i++ ) {
        var field = fields[i];
        var original = '.view-mode[data-api-name="' + field + '"]';
        var changed = '.edit-mode[data-api-name="' + field + '"]';
        $(changed).val($(original).text());
      }
  };

  var serializePerson = function serializePerson(){
    var person = {};
    _.each(fields, function(field) {
      person[field] = $('.edit-mode[data-api-name="' + field + '"]').val() || null;
    });
    return person;
  };

  var populatePerson = function populatePerson() {
    _.each(fields, function(field) {
      var selector = '.view-mode[data-api-name="' + field + '"]';
      var value = popit.model.get(field);
      if ( value === null ) {
          value = '';
      }
      $(selector).text(value);
    });
  };

  var saveChanges = function(){
    toggleSavingButton();
    popit.model.save(
      serializePerson(),
      {
        success: function() {
          populatePerson();
          toggleSavingButton();
          leaveEditMode();
        },
        error: function(obj, err) {
            console.log(err);
            showBackboneError('There was a problem saving your changes.');
            toggleSavingButton();
        }
      }
    );
  };

  var toggleSavingButton = function(){
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
  };

  var deletePersonConfirm = function(){
      if ( window.confirm('Are you sure you want to delete ' + popit.model.get('name')) ) {
        deletePerson();
      }
  };

  var deletePerson = function(){
    popit.model.destroy({
        success: function() {
          window.location = '/' + popit.type + 's';
        },
        error: function(model, response) {
          showBackboneError('There was a problem deleting this person.');
        }
    });
  };

  $(function(){
    $('.entity-enter-edit-mode').on('click', enterEditMode);
    $('#cancel-person-edit').on('click', cancelEdit);
    $('#save-person').on('click', saveChanges);
    $('#delete-person').on('click', deletePersonConfirm);
    $('.entity-details').easytabs({animate: false});
  });

});
