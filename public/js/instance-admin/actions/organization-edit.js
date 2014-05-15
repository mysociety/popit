define(['jquery'], function ($) {
  "use strict";

  var fields = ['name', 'summary', 'classification', 'parent_id', 'founding_date', 'dissolution_date'];
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
  }

  var leaveEditMode = function(){
    $('.view-mode').show();
    $('.edit-mode').hide();
    $('.entity').removeClass('editing');
    resetErrorStates();
    popit.model.off('invalid', onInvalid);
  }

  var resetErrorStates = function(){
    $('.edit-mode-error').hide();
    $('.has-error').removeClass('has-error');
    $('.alert.backbone-error').slideUp(100);
  }

  var showBackboneError = function(msg){
    var $alert = $('<div class="alert alert-danger backbone-error"><p class="container"><strong>' + msg + '</strong> Please try again.</p></div>');
    $alert.hide().insertBefore('.entity').slideDown(100);
  }

  var cancelEdit = function(){
      leaveEditMode();
      for ( var i = 0; i < fields.length; i++ ) {
        var field = fields[i];
        var original = '.view-mode[data-api-name="' + field + '"]';
        var changed = '.edit-mode[data-api-name="' + field + '"]';
        $(changed).val($(original).text());
      }
  }

  var saveChanges = function(){
    toggleSavingButton();
    for ( var i = 0; i < fields.length; i++ ) {
      var selector = '.edit-mode[data-api-name="' + fields[i] + '"]';
      var value = $(selector).val();
      popit.model.set(fields[i], value);
    }
    var dates = ['founding_date', 'dissolution_date'];
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
          showBackboneError('There was a problem saving your changes.');
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

  var deleteOrganizationConfirm = function(){
      if ( window.confirm('Are you sure you want to delete ' + popit.model.get('name')) ) {
        deleteOrganization();
      }
  }

  var deleteOrganization = function(){
    popit.model.destroy({
        success: function() {
          window.location = '/' + popit.type + 's';
        },
        error: function(model, response) {
          showBackboneError('There was a problem deleting this organization.');
        }
    });
  }

  $(function(){
    $('#edit-organization').on('click', enterEditMode);
    $('#cancel-org-edit').on('click', cancelEdit);
    $('#save-organization').on('click', saveChanges);
    $('#delete-organization').on('click', deleteOrganizationConfirm);
  });

});
