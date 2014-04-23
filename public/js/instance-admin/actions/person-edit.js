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
    setTimeout(function(){
      // This is a fake timeout, to
      // simulate the delay of an ajax save
      toggleSavingButton();
      leaveEditMode();
    }, 1500);
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
