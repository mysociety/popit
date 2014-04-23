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

  var saveChanges = function(){
    toggleSavingButton();
    popit.model.set('name', $('[data-api-name="name"]').val());
    popit.model.set('summary', $('[data-api-name="summary"]').val());
    popit.model.save(
      {},
      {
        success: function() {
          $('.view-mode[data-api-name="name"]').text(popit.model.get('name'));
          $('.view-mode[data-api-name="summary"]').text(popit.model.get('summary'));
          toggleSavingButton();
          leaveEditMode();
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
    $('.entity-leave-edit-mode').on('click', leaveEditMode);
    $('.entity-save-changes').on('click', saveChanges);
  });

});
