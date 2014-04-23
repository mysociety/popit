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
        $('.edit-mode[data-api-name="name"]').parent().addClass('has-error');
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

  $(function(){
    $('.entity-enter-edit-mode').on('click', enterEditMode);
    $('.entity-leave-edit-mode').on('click', cancelEdit);
    $('.entity-save-changes').on('click', saveChanges);
  });

});
