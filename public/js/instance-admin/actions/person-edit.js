define(['jquery'], function ($) {
  "use strict";

  var enterEditMode = function(){
    $('.entity-viewing-toolbar').hide();
    $('.entity-editing-toolbar').show();
      $('.edit-group').each(function() {
          $(this).children('.hidden').removeClass('hidden');
          $(this).children('.edit-static').addClass('hidden');
      });
  }

  var leaveEditMode = function(){
    $('.entity-viewing-toolbar').show();
    $('.entity-editing-toolbar').hide();
      $('.edit-group').each(function() {
          $(this).children().addClass('hidden');
          $(this).children('.edit-static').removeClass('hidden');
      });
  }

  var saveChanges = function(){
    toggleSavingButton();
    popit.model.set('name', $('[name="name"]').val());
    popit.model.set('summary', $('[name="summary"]').val());
    popit.model.save(
        {},
        {
            success: function() {
              $('#entity-name-in-header').text(popit.model.get('name'));
              $('#entity-summary-text').text(popit.model.get('summary'));
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
